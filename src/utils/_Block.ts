import { EventBus } from "./EventBus";
import { nanoid } from 'nanoid';
import { isArray } from "./helpers/typeCheck";

export enum EVENTS {
    INIT = "init",
    FLOW_CDM = "flow:component-did-mount",
    FLOW_CDUM = "flow:component-did-un-mount",
    FLOW_CDU = "flow:component-did-update",
    FLOW_RENDER = "flow:render" //,
   // HIDE = "hide",
   // SHOW = "show"
};

type Children = Record<string, _Block[] | _Block>;
export type Events = Record<string, AnyFunctionNoReturn>;

export type CompileOptions = { 
    template?: Handlebars.TemplateDelegate<any>, 
    styles?: Record<string, string>,
    [index: string]: any 
};

/*export type TemplateOptions = { 
    styles?: Record<string, any>,
    addChild: (child: _Block) => void,
    [index: string]: any
};*/


export type Props<T> = { 
    events?: Events, 
    attachName?: string
} & T;

// базовый класс для компонентов
export class _Block<T extends Record<string, any> = any> {

    private element: HTMLElement | null = null;
    private children: Children = {};

    private readonly eventBus: EventBus;
    private readonly props: Props<T>;
    private readonly id: string;
    private isMounted: boolean;

    constructor(props: Props<T>) {
        this.eventBus = new EventBus();

        this.id = nanoid(6);
        this.isMounted = false;
        props.attachName = props.attachName || this.id;

        this.props = this.makePropsProxy(props, this.eventBus);
        this.registerLifeCycleEvents(this.eventBus);
        this.eventBus.emit(EVENTS.INIT);
    }

    //   
    protected init(): void { };

    // Может переопределять пользователь, необязательно трогать
    // после добавления в документ
    protected componentDidMount(): void { };
    // после удаления из документа
    protected componentDidUnMount(): void { };

    // Может переопределять пользователь, необязательно трогать
    protected componentDidUpdate(_oldProps: T, _newProps: T): boolean { return true; };

    protected getCompileOptions(): CompileOptions { return {}; };

    // constructor
    protected registerLifeCycleEvents(eventBus: EventBus): void {
        eventBus.on(EVENTS.INIT, this.onInit.bind(this));
        eventBus.on(EVENTS.FLOW_CDM, this.onComponentDidMount.bind(this));
        eventBus.on(EVENTS.FLOW_CDUM, this.onComponentDidUnMount.bind(this));
        
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

        const events = this.getDomEvents();
        const element = this.element;
        if (!this.element || !events) return;

        
        Object.keys(events).forEach(eventName => {       
            //console.info(element, eventName);
                 
            if (value) {
                //keyof HTMLElementEventMap
                element?.addEventListener(eventName, events[eventName]);
            }
            else {
                element?.removeEventListener(eventName, events[eventName]);
            }
        });
    }

    protected getDomEvents(): Events | undefined {
        return this.props.events;
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

    public getChildByAttacheNameOne(attacheName: string | string[]): _Block | null {

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

    public getProps(): Props<T> {
        return this.props;
    }

    public setProps(nextProps: Partial<T>): void {
        if (!nextProps) {
            return;
        }

        Object.assign(this.props, nextProps);
    }

    public readonly show = (args?: Record<string, any>) => {
        this.toggleVisible(true, args);
        //this.eventBus.emit(EVENTS.SHOW);
        this.dispatchComponentDidMount();
    }

    public readonly hide = (args?: Record<string, any>) => {
        this.toggleVisible(false, args);
        //this.eventBus.emit(EVENTS.HIDE);
        this.dispatchComponentDidUnMount();
    }

    protected toggleVisible(value: boolean, _args?: Record<string, any>): void { 
        if (this.element === null) return;
        this.element.style.display = value ? "block" : "none";
    }

    protected visibleChild(visible: boolean, childName: string) {
        const dialog = this.getChildByAttacheNameOne(childName);
        visible ? dialog?.show() : dialog?.hide();
    }

}

