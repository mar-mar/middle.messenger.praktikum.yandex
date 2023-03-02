import { EventBus } from "./EventBus";
import { nanoid } from 'nanoid';
import { AnyFunctionNoReturn } from "./types";
import { isArray } from "./typeCheck";

export enum EVENTS {
    INIT = "init",
    FLOW_CDM = "flow:component-did-mount",
    FLOW_CDU = "flow:component-did-update",
    FLOW_RENDER = "flow:render"
};

type Children = Record<string, _Block[] | _Block>;
type Events = Record<string, AnyFunctionNoReturn>;
export type Props = { events?: Events, attachName?: string } & Omit<Record<string, any>, "events" >;
type CompileOptions<T> = { 
    template?: Handlebars.TemplateDelegate<any>, 
    styles?: Record<string, string>, 
    defaultValues?: Partial<T>
};

// базовый класс для компонентов
export class _Block<T extends Props = any> {

    private element: HTMLElement | null = null;
    private children: Children = {};

    private readonly eventBus: EventBus;
    private readonly props: T;
    private readonly id: string;

    constructor(options: T) {
        const props: T = options.props || {};
        this.eventBus = new EventBus();

        this.id = nanoid(6);
        props.attachName = props.attachName || this.id;

        this.props = this.makePropsProxy(props, this.eventBus);
        this.registerLifeCycleEvents(this.eventBus);
        this.eventBus.emit(EVENTS.INIT);
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

                const oldValue = target[key as keyof T];
                if (oldValue === value) return true;

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

    public toggleVisible(value: boolean): void {
        if (this.element === null) return;
        this.element.style.display = value ? "block" : "none";
    }

    protected compile({ template, styles, ...args } : CompileOptions<T>) {
    
        const temp = document.createElement('template');
        const children: _Block[] = [];

        if (template) {
            temp.innerHTML = template({ 
                ...args, 
                ...this.props,
                styles, 
                children, 
                item: {}
            });
        }

        this.children = {};

        if (temp.content.firstElementChild) {

            children.forEach(child => {
                this.addChild(child);

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

    private addChild(child: _Block): void {
        const attachName = child.getProps().attachName || child.getId();
        let children = this.children[attachName];
        if (!children) {
            this.children[attachName] = child;
        }
        else if (isArray(children)) {
            children.push(child);
        }
        else {
            this.children[attachName] = [children, child];
        }
    }

    public forEachChildren(callbackfn: (child: _Block, childName: string) => void): void {

        Object.entries(this.children).forEach(([childName, item]) => {

            const children = Array.isArray(item) ? item : [item];
            children.forEach(child => {
                callbackfn(child, childName);
            });
        })
    }

    public getId(): string {
        return this.id;
    }

    public getElement(): HTMLElement | null {
        return this.element;
    }

    protected getChildByAttacheName(attacheName: string): _Block[] | _Block | null {
        return this.children[attacheName];
    }

    protected getChildByAttacheNameOne(attacheName: string): _Block | null {
        const children = this.getChildByAttacheName(attacheName);
        return Array.isArray(children) ? children[0] : children;
    }

    protected getEventBus(): EventBus {
        return this.eventBus;
    }

    public getProps(): T {
        return this.props;
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
}

