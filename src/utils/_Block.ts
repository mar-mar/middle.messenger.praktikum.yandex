import { EventBus } from "./EventBus";
import { nanoid } from "nanoid";
import { isArray } from "./helpers/typeCheck";

export enum EVENTS {
    INIT = "init",
    FLOW_CDM = "flow:component-did-mount",
    FLOW_CDUM = "flow:component-did-un-mount",
    FLOW_CDU = "flow:component-did-update",
    FLOW_RENDER = "flow:render"
}

type Children = Record<string, _Block[] | _Block>;
export type Events = Record<string, EventListener>;

export type CompileOptions = { 
    template?: Handlebars.TemplateDelegate<any>, 
    styles?: Record<string, string>,
    [index: string]: unknown 
};

export interface VisibleProps {
    parent?: Element;
}

export interface BlockConstructable<P extends BlockProps = any> {
    new(props: P): _Block<P>;
}

export interface BlockProps {
    events?: Events;
    attachName?: string; 
}


// базовый класс для компонентов
export class _Block<T extends BlockProps = BlockProps> {

    private element: HTMLElement | null = null;
    private children: Children = {};

    private readonly eventBus: EventBus;
    private readonly props: T;
    private readonly id: string;
    private isMounted: boolean;

    constructor(props: T) {
        this.eventBus = new EventBus();

        this.id = nanoid(6);
        this.isMounted = false;

        
        props = this.prepareProps(props);

        this.props = this.makePropsProxy(props, this.eventBus);
        this.registerLifeCycleEventsBase(this.eventBus);
        this.eventBus.emit(EVENTS.INIT);
    }   

    //   
    protected init(): void { }

    // Может переопределять пользователь, необязательно трогать
    // после добавления в документ
    protected componentDidMount(): void { }
    // после удаления из документа
    protected componentDidUnMount(): void { }

    // Может переопределять пользователь, необязательно трогать
    protected componentDidUpdate(_oldProps: T, _newProps: T): boolean { return true; }

    protected getCompileOptions(): CompileOptions { return {}; }

    protected registerLifeCycleEvents(_eventBus: EventBus) {}

    // constructor
    protected prepareProps(props: T): T {
        props.attachName = props.attachName || this.id;
        return props;
    }

    // constructor
    protected registerLifeCycleEventsBase(eventBus: EventBus): void {

        eventBus.on(EVENTS.INIT, this.onInit.bind(this));
        eventBus.on(EVENTS.FLOW_CDM, this.onComponentDidMount.bind(this));
        eventBus.on(EVENTS.FLOW_CDUM, this.onComponentDidUnMount.bind(this));
        
        eventBus.on(EVENTS.FLOW_CDU, this.onComponentDidUpdate.bind(this));
        eventBus.on(EVENTS.FLOW_RENDER, this.onRender.bind(this));
        this.registerLifeCycleEvents(eventBus);
    }

    // constructor
    private makePropsProxy(props: T, eventBus: EventBus): T {

        props = new Proxy(props, {

            set(target: T, key: string, value: unknown): boolean {

                const oldValue = target[key as keyof T];
                if (oldValue === value) return true;

                const oldTarget: T = { ...target };

                const propKey: keyof T = key as keyof T;
                target[propKey] = value as T[typeof propKey];

                eventBus.emit(EVENTS.FLOW_CDU, oldTarget, target);

                return true;
            },

            get(target: T, key: string): unknown {

                const value = target[key as keyof T];
                return (typeof value === "function") ? value.bind(target) : value;
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
        this.isMounted = true;
        this.componentDidMount();
    }

    //CD-UM
    public dispatchComponentDidUnMount(): void {
        this.eventBus.emit(EVENTS.FLOW_CDUM);

        this.forEachChildren((child, _) => {
            child.dispatchComponentDidUnMount();
        });
    }

    //CD-UM
    private onComponentDidUnMount(): void {
        this.isMounted = false;
        this.componentDidUnMount();
    }   

    //CDU
    private onComponentDidUpdate(oldProps: T, newProps: T): void {
        if (this.componentDidUpdate(oldProps, newProps)) {
            this.eventBus.emit(EVENTS.FLOW_RENDER);
        }
    }

    protected reset() {
        this.eventBus.emit(EVENTS.FLOW_RENDER);
    }

    //render
    private onRender(): void {

        this.toggleDomEvents(false);
        this.children = {};

        const newElement = this.compile(this.getCompileOptions()); // тут заполняются children

        const oldElement = this.element;
        this.element = newElement;
        this.renderDependens();

        if (this.element && oldElement) {
            oldElement.replaceWith(this.element);
        }

        this.toggleDomEvents(true);

        if (this.isMounted) {
            this.forEachChildren((child, _) => {
                child.dispatchComponentDidMount();
            });
        }
    }

    //render
    private toggleDomEvents(value: boolean): void {
        if (!this.element) return;

        const events = this.props.events;
        const element = this.element;
        if (!this.element || !events) return;

        
        Object.keys(events).forEach(eventName => {       
                   
            if (value) {
                //keyof HTMLElementEventMap
                element?.addEventListener(eventName, events[eventName]);
            }
            else {
                element?.removeEventListener(eventName, events[eventName]);
            }
        });
    }

    private compile({ template, styles, ...args } : CompileOptions) {
    
        const temp = document.createElement("template");

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
    private renderDependens() {
        this.renderChildren();

        this.forEachChildren((child, _) => {
            child.renderDependens();
        });
    }
    
    //render
    private renderChildren() {
        if (!this.element) return;

        this.forEachChildren(child => {

            const stub = this.element?.querySelector(`[data-id="${child.id}"]`);
            if (!stub) return; // чистить или нет childElement?

            const childElement = child.getElement();
            if (!childElement) return;

            stub.replaceWith(childElement); // меняем заглушку на нормальный dom
            
            if (stub.childNodes.length > 0) { // что-то есть внутри
                
                const contentCont = childElement.querySelector("[data-content]") ?? stub;
                contentCont.innerHTML = "";
                contentCont.replaceWith(...Array.from(stub.childNodes));
            } 
        });
    }

    public addChild(child: _Block): void {
        const attachName = child.getProps().attachName || child.getId();
        const children = this.children[attachName];

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

    public getChildByAttacheName(attacheName: string): _Block[] | _Block | null {
        return this.children[attacheName];
    }

    public getChildByAttacheNameOne(attacheName: string | string[]): _Block | null {

        // eslint-disable-next-line @typescript-eslint/no-this-alias
        let child: _Block | null = this;
        attacheName = isArray(attacheName) ? attacheName : [attacheName];

        const isOk = attacheName.every(name => {
            child = child?._getChildByAttacheNameOne(name) || null;
            return child;
        });
        
        return isOk ? child : null;
    }

    private _getChildByAttacheNameOne(attacheName: string): _Block | null {

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

    public readonly show = (args?: VisibleProps) => {
        this.toggleVisible(true, args);
        
        this.dispatchComponentDidMount();
    }

    public readonly hide = (args?: VisibleProps) => {
        this.toggleVisible(false, args);
        
        this.dispatchComponentDidUnMount();
    }

    protected toggleVisible(value: boolean, _args?: VisibleProps): void { 
        if (this.element === null) return;
        this.element.style.display = value ? "block" : "none";
    }

    protected visibleChild(visible: boolean, childName: string) {
        const dialog = this.getChildByAttacheNameOne(childName);
        visible ? dialog?.show() : dialog?.hide();
    }

}

