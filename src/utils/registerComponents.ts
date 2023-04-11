import Handlebars from "handlebars/runtime";
import { _Block } from "./_Block";
import { isFunction } from "./helpers/typeCheck";
import { BlockConstructable } from "./_Block";


export default function execute() {
    
    const componentsModules = require.context("../", true, /.*\/components\/[a-zA-Z]+\/index.ts$/);
    
    const layoutModules = require.context("../", true, /.*\/layout\/[a-zA-Z]+\/index.ts$/);
    
    const modulesModules = require.context("../", true, /.*\/modules\/[a-zA-Z]+\/index.ts$/);

    registerComponents(componentsModules, "components", []);
    registerComponents(layoutModules, "layout", []);
    registerComponents(modulesModules, "modules", []);
}

//@types/webpack-env
function registerComponents(modules: __WebpackModuleApi.RequireContext, _type: string, _path: string[]): void {

    modules.keys().forEach((key: string) => {
        const module = modules(key);

        if (module.default) {
            
            const currentPath = key.slice(2, -3).split("/");
            currentPath.pop();

            handleharRegisterHelper(currentPath.join("_"), module.default);
        }

    });
}

function handleharRegisterHelper(name: string,
    constructor: BlockConstructable): void {

    Handlebars.registerHelper(name, function (this: unknown, options: Handlebars.HelperOptions): string {

        const events: Record<string, EventListener> = {};
        const props: PlainObject = { ...options.hash };

        // обрабатываем ключи [event:<событие>]
        Object.entries(props).forEach(([key, value]) => {

            if (key.startsWith("event:") && isFunction(value)) {

                const handlerKey = key.replace("event:", "");
                events[handlerKey] = value as EventListener;
                delete props[key];
            }
        });

        const data = options.data;
        // addChild либо в root, либо к компоненту, который на уровень выше
        const addChild: (child: _Block) => void = data.addChilToChild ? data.addChilToChild : data.root.addChild;
        props.events = events;

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

