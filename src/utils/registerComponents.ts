import Handlebars from "handlebars/dist/handlebars.runtime";
import { _Block } from "./_Block";
import { isFunction } from "./helpers/typeCheck";


// без ts-ignore не работает, ts не понимает такие импорты, это фича от parcel (@parcel/resolver-glob)
// @ts-ignore 
import componentsModules from "../**/components/*/index.ts";
// @ts-ignore
import layoutModules from "../**/layout/*/index.ts";
// @ts-ignore
import modulesModules from "../**/modules/*/index.ts";


export default function execute() {
    registerComponents(componentsModules, "components", []);
    registerComponents(layoutModules, "layout", []);
    registerComponents(modulesModules, "modules", []);
}

function registerComponents(modules: Record<string, any>, type: string, path: string[]): void{
    Object.entries(modules).forEach(([name, module]) => {
        const currentPath = [...path];
        currentPath.push(name);

        if ((module as any).default) {
            currentPath.splice(-1, 0, type);
            handleharRegisterHelper(currentPath.join("_"), (module as any).default);
        }
        else {
            
            registerComponents(module, type, currentPath);
        }
    });
}

function handleharRegisterHelper<T extends _Block>(name: string, 
    constructor: new(options: any) => T): void { 

    Handlebars.registerHelper(name, function (this: any, options: Handlebars.HelperOptions): string {

        const events: Record<string, AnyFunction> = {};
        const props: Record<string, any> = { ...options.hash };

        // обрабатываем ключи [event:<событие>]
        Object.entries(props).forEach(([key, value]) => {

            if (key.startsWith("event:") && isFunction(value)) {

                const handlerKey = key.replace("event:", "");
                events[handlerKey] = value;
                delete props[key];
            }
        });

        const data = options.data;
        // addChild либо в root, либо к компоненту, который на уровень выше
        const addChild: (child: _Block) => void = data.addChilToChild ? data.addChilToChild : data.root.addChild;
        props.events = events;
        props.render = true;

        const component = new constructor(props);
        addChild(component);    

        let childsStr = "";
        if (options.fn) {

            childsStr = options.fn(this, { 
                data: { 
                    ...data,
                    // addChilToChild чтобы сохранить вложенность детей из шаблона
                    addChilToChild: component.addChild.bind(component) 
                }
            });
        }

        return `<div data-id='${component.getId()}'>${childsStr}</div>`;
    });
}
