import Handlebars from "handlebars/runtime";
import { _Block } from "./_Block";
import { isFunction } from "./helpers/typeCheck";


export default function execute() {
    // @ts-ignore 
    const componentsModules = require.context('../', true, /.*\/components\/[a-zA-Z]+\/index.ts$/);
    // @ts-ignore 
    const layoutModules = require.context('../', true, /.*\/layout\/[a-zA-Z]+\/index.ts$/);
    // @ts-ignore 
    const modulesModules = require.context('../', true, /.*\/modules\/[a-zA-Z]+\/index.ts$/);

    registerComponents(componentsModules, "components", []);
    registerComponents(layoutModules, "layout", []);
    registerComponents(modulesModules, "modules", []);
}

//@types/webpack-env
function registerComponents(modules: any, _type: string, _path: string[]): void {
    console.info(modules);

    modules.keys().forEach((key: string) => {
        const module = modules(key);

        if ((module as any).default) {
            //"./pages/index/modules/addChatDialogBody/index.ts"
            const currentPath = key.slice(2, -3).split("/");
            currentPath.pop();
            console.info("*"+currentPath.join("_")+"*", (module as any).default);
            handleharRegisterHelper(currentPath.join("_"), (module as any).default);
        }
       // else {

            //registerComponents(module, type, currentPath);
       // }
    });
}

function handleharRegisterHelper<T extends _Block>(name: string,
    constructor: new (options: any) => T): void {

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

