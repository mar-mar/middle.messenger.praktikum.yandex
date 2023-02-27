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

export type Props = {
    events?: Events;
    children?: Children;
    [index: string]: any;
};

export class _Block<
    T extends Props = {}>{

    private element: HTMLElement | null = null;
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

    // abstract Может переопределять пользователь, необязательно трогать
    protected render(): DocumentFragment | null { return null };

    // constructor
    private registerEvents(eventBus: EventBus): void {
        eventBus.on(EVENTS.INIT, this.onInit.bind(this));
        eventBus.on(EVENTS.FLOW_CDM, this.onComponentDidMount.bind(this));
        eventBus.on(EVENTS.FLOW_CDU, this.onComponentDidUpdate.bind(this));
        eventBus.on(EVENTS.FLOW_RENDER, this.onRender.bind(this));
    }

    // constructor
    private makePropsProxy(props: Props, eventBus: EventBus): Props {
        // Можно и так передать this
        // Такой способ больше не применяется с приходом ES6+
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
        const fragment: DocumentFragment | null = this.render();
        const newElement = fragment ? fragment.firstElementChild as HTMLElement : null;
        
        // todo remove Events
        // empty(this._element) ?
        if (this.element && newElement) {
            this.element.replaceWith(newElement);
        }
        //removeChild ? 
        this.element = newElement;

        this.addEvents();
    }

    //render
    private addEvents(): void {
        if (!this.element) return;

        Object.keys(this.events).forEach(eventName => {
            this.element?.addEventListener(eventName, this.events[eventName]);
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

    protected compile(template: (context: any) => string, styles: Record<string, string>): DocumentFragment {
        
       /* const byId = new Map<string, _Block>();
            const children: Record<string, string[]> = {};
            this.forEachChildren((child, childName) => {
            byId.set(child.id, child);
           
            // отличать детей от свойств?
            children[childName] = children[childName] || [];
            children[childName].push(`<div data-id="${child.id}"></div>`);
        });
*/
        const temp = document.createElement('template');
        const children: Children = {};
        const events: Events = {};
        temp.innerHTML = template({ styles, ...this.props, children, events, component: this });

        this.children = children;
        this.events = events;

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

        return temp.content;
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

