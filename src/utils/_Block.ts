import { EventBus } from "./EventBus";
import { nanoid } from 'nanoid';
import { AnyFunctionNoReturn } from "./types";


export enum EVENTS {
    INIT = "init",
    FLOW_CDM = "flow:component-did-mount",
    FLOW_CDU = "flow:component-did-update",
    FLOW_RENDER = "flow:render"
};

type Children = Record<string, _Block[] | _Block>;
type Events = Record<string, AnyFunctionNoReturn>;
export type Props = { events?: Events } & Omit<Record<string, any>, "events" >;
type CompileOptions<T> = { 
    template?: Handlebars.TemplateDelegate<any>, 
    styles?: Record<string, string>, 
    defaultValues?: Partial<T>
};

// базовый класс для компонентов
export class _Block<T extends Props = any> {

    private element: HTMLElement | null = null;
    private eventBus: EventBus;

    private props: T;
    private children: Children = {};
    public readonly id: string;

    constructor(options: T) {
        const props: T = options.props || {};
        this.id = props.id ?? nanoid(6);

        this.eventBus = new EventBus();

        this.props = this.makePropsProxy(props, this.eventBus);
        this.registerLifeCycleEvents(this.eventBus);
        this.eventBus.emit(EVENTS.INIT);
    }

    public getElement(): HTMLElement | null {
        return this.element;
    }

    protected getEventBus(): EventBus {
        return this.eventBus;
    }

    protected getProps(): T {
        return this.props;
    }

    //abstract  
    protected init(): void { };

    // abstract Может переопределять пользователь, необязательно трогать
    protected componentDidMount(/*oldProps*/): void { };

    // abstract Может переопределять пользователь, необязательно трогать
    protected componentDidUpdate(_oldProps: Props, _newProps: Props): boolean { return true; };

    protected getCompileOptions(): CompileOptions<T> { return {}; };

    // abstract Может переопределять пользователь, необязательно трогать
    //protected render(): DocumentFragment | null { return null };

    // constructor
    private registerLifeCycleEvents(eventBus: EventBus): void {
        eventBus.on(EVENTS.INIT, this.onInit.bind(this));
        eventBus.on(EVENTS.FLOW_CDM, this.onComponentDidMount.bind(this));
        eventBus.on(EVENTS.FLOW_CDU, this.onComponentDidUpdate.bind(this));
        eventBus.on(EVENTS.FLOW_RENDER, this.onRender.bind(this));
    }

    // constructor
    private makePropsProxy(props: T, eventBus: EventBus): T {

        props = new Proxy(props, {
            set(target: T, key: string, value: any): boolean {
                const oldTarget: any = { ...target };
                target[key as keyof T] = value;

                eventBus.emit(EVENTS.FLOW_CDU, oldTarget, target);

                return true;
            },

            get(target: T, key: string): any {
                let value = target[key];
                return (typeof value === 'function') ? value.bind(target) : value;
            },

            deleteProperty(/*target: Props, prop: string*/) {
                throw new Error("нет доступа");
            }
        });

        return props;
    }

    private onInit(): void {
        this.init();
        this.eventBus.emit(EVENTS.FLOW_RENDER);
    }

    //CDM
    public dispatchComponentDidMount(): void {
        this.eventBus.emit(EVENTS.FLOW_CDM);

        this.forEachChildren((child, _) => {
            child.dispatchComponentDidMount();
        });
    }

    //CDM
    private onComponentDidMount(): void {
        this.componentDidMount();
    }

    //CDU
    private onComponentDidUpdate(oldProps: T, newProps: T): void {
        if (this.componentDidUpdate(oldProps, newProps)) {
            this.eventBus.emit(EVENTS.FLOW_RENDER);
        }
    }

    //render
    private onRender(): void {

        this.toggleDomEvents(false);
        this.compile(this.getCompileOptions());
        this.toggleDomEvents(true);
    }

    //render
    private toggleDomEvents(value: boolean): void {
        if (!this.element) return;

        const events = this.props.events;
        const element = this.element;
        if (!this.element || !events) return;

        Object.keys(events).forEach(eventName => {            
            if (value) {
                element?.addEventListener(eventName, events[eventName]);
            }
            else {
                element?.removeEventListener(eventName, events[eventName]);
            }
        });
    }

    public setProps(nextProps: Partial<T>): void {
        if (!nextProps) {
            return;
        }

        Object.assign(this.props, nextProps);
    }

    public show(): void {
        this.toggleVisible(true);
    }

    public hide(): void {
        this.toggleVisible(false);
    }

    public toggleVisible(value: boolean): void {
        if (this.element === null) return;
        this.element.style.display = value ? "block" : "none";
    }

    protected compile({ template, styles, ...args } : CompileOptions<T>) {
    
        const temp = document.createElement('template');
        const children: Children = {};

        if (template) {
            temp.innerHTML = template({ 
                ...args, 
                ...this.props,
                styles, 
                children, 
                item: {},
                component: this 
            });
        }

        this.children = {};
        

        if (temp.content.firstElementChild) {
            this.children = children;

            this.forEachChildren((child, _childName) => {
                const stub = temp.content.querySelector(`[data-id="${child.id}"]`);
                if (!stub) return; // чистить или нет childElement?
    
                const childElement = child.getElement()!;
                stub.replaceWith(childElement); // меняем заглушку на нормальный dom
                
                if (stub.childNodes.length > 0) { // что-то есть внутри
                    
                    const contentCont = temp.content.querySelector(`[data-content]`) ?? stub;
                    contentCont.innerHTML = "";
                    contentCont.replaceWith(...Array.from(stub.childNodes));
                } 
            });
        }

        const newElement = temp.content ? temp.content.firstElementChild as HTMLElement : null;

        if (this.element && newElement) {
            this.element.replaceWith(newElement);
        }

        this.element = newElement;
    }

    private forEachChildren(callbackfn: (child: _Block, childName: string) => void): void {

        Object.entries(this.children).forEach(([childName, item]) => {

            const children = Array.isArray(item) ? item : [item];
            children.forEach(child => {
                callbackfn(child, childName);
            });
        })
    }
}

