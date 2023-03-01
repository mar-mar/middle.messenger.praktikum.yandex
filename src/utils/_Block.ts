import { EventBus } from "./EventBus";
import { nanoid } from 'nanoid';
//import { Props } from "./Props";

//namespace _Block {
export enum EVENTS {
    INIT = "init",
    FLOW_CDM = "flow:component-did-mount",
    FLOW_CDU = "flow:component-did-update",
    FLOW_RENDER = "flow:render"
}
//}

type Children = Record<string, _Block[] | _Block>;
type Events = Record<string, () => void>;
type CompileOptions = { template?: (context: any) => string, styles?: Record<string, string> };

export type Props = {
    events?: Events;
    children?: Children;
    [index: string]: any;
};

export class _Block<
    T extends Props = {}>{

    private element: HTMLElement | null = null;
    private focusElement: HTMLElement | null = null;
    private eventBus: EventBus;

    protected props: Props;
    protected events: Events;
    private children: Children = {};
    public readonly id: string;

    constructor(options: T) {
        const props: Props = options.props || {};
        this.id = props.id ?? nanoid(6);
        //this.children = options.children || {};
        this.events = options.events || {};
        this.eventBus = new EventBus();

        this.props = this.makePropsProxy(props, this.eventBus);
        this.registerEvents(this.eventBus);
        this.eventBus.emit(EVENTS.INIT);
    }

    public getElement(): HTMLElement | null {
        return this.element;
    }

    protected getEventBus(): EventBus {
        return this.eventBus;
    }

    //abstract  
    protected init(): void { };

    // abstract Может переопределять пользователь, необязательно трогать
    protected componentDidMount(/*oldProps*/): void { };

    // abstract Может переопределять пользователь, необязательно трогать
    protected componentDidUpdate(_oldProps: Props, _newProps: Props): boolean { return true; };

    protected getCompileOptions(): CompileOptions { return {}; };

    // abstract Может переопределять пользователь, необязательно трогать
    //protected render(): DocumentFragment | null { return null };

    // constructor
    private registerEvents(eventBus: EventBus): void {
        eventBus.on(EVENTS.INIT, this.onInit.bind(this));
        eventBus.on(EVENTS.FLOW_CDM, this.onComponentDidMount.bind(this));
        eventBus.on(EVENTS.FLOW_CDU, this.onComponentDidUpdate.bind(this));
        eventBus.on(EVENTS.FLOW_RENDER, this.onRender.bind(this));
    }

    // constructor
    private makePropsProxy(props: Props, eventBus: EventBus): Props {

        props = new Proxy(props, {
            set(target: Props, key: string, value: any): boolean {
                const oldTarget: any = { ...target };
                target[key as keyof Props] = value;

                eventBus.emit(EVENTS.FLOW_CDU, oldTarget, target);

                return true;
            },

            get(target: Props, key: string): any {
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
    private onComponentDidUpdate(oldProps: any, newProps: any): void {
        if (this.componentDidUpdate(oldProps, newProps)) {
            this.eventBus.emit(EVENTS.FLOW_RENDER);
        }
    }

    //render
    private onRender(): void {
        //const fragment: DocumentFragment | null = this.render();
        //unlickEvents
        this.compile(this.getCompileOptions());
        this.linkEvents();
    }

    //render
    private linkEvents(): void {
        if (!this.element) return;

        Object.keys(this.events).forEach(eventName => {
            let element = this.element;
            if ("blur" === eventName || "focus" === eventName) {
                element = this.focusElement;
            }
            
            element?.addEventListener(eventName, this.events[eventName]);
        });
    }

    /*public setProps(nextProps: Props): void {
        if (!nextProps) {
            return;
        }

        Object.assign(this.props, nextProps);
    }

    public getProps() {

    }*/

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

    protected compile({ template, styles } : CompileOptions) {
    
        const temp = document.createElement('template');
        const children: Children = {};

        if (template) {
            temp.innerHTML = template({ styles, ...this.props, children, component: this });
        }

        this.children = {};
        const newElement = temp.content ? temp.content.firstElementChild as HTMLElement : null;
        const focusElement = newElement ? newElement.querySelector("[data-focused]") : null;

        if (newElement) {
            this.children = children;

            this.forEachChildren((child, _childName) => {
                const stub = newElement.querySelector(`[data-id="${child.id}"]`);
                if (!stub) return; // чистить или нет childElement?
    
                const childElement = child.getElement()!;
                stub.replaceWith(childElement); // меняем заглушку на нормальный dom
                
                if (stub.childNodes.length > 0) { // что-то есть внутри
                    
                    const contentCont = newElement.querySelector(`[data-content]`) ?? stub;
                    contentCont.innerHTML = "";
                    contentCont.replaceWith(...Array.from(stub.childNodes));
                } 
            });
        }

        // todo remove Events
        // empty(this._element) ?
        if (this.element && newElement) {
            this.element.replaceWith(newElement);
        }
        //removeChild ? 
        this.focusElement = focusElement ? focusElement as HTMLElement : null;
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

