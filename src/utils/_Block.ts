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

export type CompileOptions = { 
    template?: Handlebars.TemplateDelegate<any>, 
    styles?: Record<string, string>,
    [index: string]: any 
};

export type TemplateOptions = { 
    styles?: Record<string, any>,
    addChild: (child: _Block) => void,
    [index: string]: any 
};

export type Props<P extends Record<string, unknown> = any> = { events?: Events, attachName?: string, render?: boolean; item?: any } & P;


// базовый класс для компонентов
export class _Block<T extends Record<string, unknown> = any> {

    private element: HTMLElement | null = null;
    private children: Children = {};

    private readonly eventBus: EventBus;
    private readonly props: Props<T>;
    private readonly id: string;

    constructor(props: Props<T>) {
        this.eventBus = new EventBus();

        this.id = nanoid(6);
        props.attachName = props.attachName || this.id;

        this.props = this.makePropsProxy(props, this.eventBus);
        this.registerLifeCycleEvents(this.eventBus);
        this.eventBus.emit(EVENTS.INIT);
    }

    //   
    protected init(): void { };

    // Может переопределять пользователь, необязательно трогать
    protected componentDidMount(/*oldProps*/): void { };

    // Может переопределять пользователь, необязательно трогать
    protected componentDidUpdate(_oldProps: Props<T>, _newProps: Props<T>): boolean { return true; };

    protected getCompileOptions(): CompileOptions { return {}; };

    // Может переопределять пользователь, необязательно трогать
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
    private onComponentDidUpdate(oldProps: Props<T>, newProps: Props<T>): void {
        if (this.componentDidUpdate(oldProps, newProps)) {
            this.eventBus.emit(EVENTS.FLOW_RENDER);
        }
    }

    //render
    private onRender(): void {

        this.toggleDomEvents(false);
        this.children = {};

        const newElement = this.compile(this.getCompileOptions());

        const oldElement = this.element;
        this.element = newElement;
        this.renderDependens();

        if (this.element && oldElement) {
            oldElement.replaceWith(this.element);
        }

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

    protected compile({ template, styles, ...args } : CompileOptions) {
    
        const temp = document.createElement('template');

        if (template) {
            temp.innerHTML = template({ 
                ...args, 
                ...this.props,
                styles, 
                addChild: this.addChild.bind(this)
            });
        }

        const newElement = temp.content ? temp.content.firstElementChild as HTMLElement : null;
        return newElement;
    }

    //render
    public renderDependens() {
        this.renderChildren();

        this.forEachChildren((child, _) => {
            child.renderDependens();
        });
    }
    
    //render
    private renderChildren() {
        if (!this.element) return;

        this.forEachChildren(child => {

            const stub = this.element!.querySelector(`[data-id="${child.id}"]`);
            if (!stub) return; // чистить или нет childElement?

            const childElement = child.getElement()!;
            stub.replaceWith(childElement); // меняем заглушку на нормальный dom
            
           if (stub.childNodes.length > 0) { // что-то есть внутри
                
                const contentCont = childElement.querySelector(`[data-content]`) ?? stub;
                contentCont.innerHTML = "";
                contentCont.replaceWith(...Array.from(stub.childNodes));
            } 
        });
    }

    public addChild(child: _Block): void {
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

    public getProps(): Props<T> {
        return this.props;
    }

    public setProps(nextProps: Partial<Props<T>>): void {
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
}

