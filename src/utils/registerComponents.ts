import Handlebars from "handlebars/dist/handlebars.runtime";
import { _Block } from "./_Block";
import { isFunction } from "./typeCheck";
import {AnyFunction} from "./types";

export function registerComponent<T extends _Block>(name: string, 
    constructor: new(options: any) => T): void { // todo options: any ??? как  правильно

    Handlebars.registerHelper(name, function (this: any, options: any): string {

        const templateData = options.data.root;
        const parentComponent = templateData.component;
        const events: Record<string, AnyFunction> = {};
        const props: Record<string, any> = { ...options.hash };

        Object.entries(props).forEach(([key, value]) => {

            const handler = parentComponent[value];
            if (key.startsWith("event:") && isFunction(handler)) {

                const handlerKey = key.replace("event:", "");
                events[handlerKey] = handler.bind(parentComponent);
                delete props[key];
            }
        });

        const component = new constructor({ props, events });
        templateData.children[component.id] = component;

        if (options.fn) {
            return `<div data-id='${component.id}'>${options.fn(this)}</div>`;
        }

        return `<div data-id='${component.id}'></div>`;
    });
}

/*Handlebars.registerHelper("events", function () {
    debugger
    console.info(arguments);
    return { event: [...arguments] };
});*/
