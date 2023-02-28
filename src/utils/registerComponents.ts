import Handlebars from "handlebars/dist/handlebars.runtime";

import { _Block } from "./_Block";

export function registerComponent<T extends _Block>(name: string, 
    constructor: new(options: any) => T): void { // todo options: any ??? как  правильно

    Handlebars.registerHelper(name, function (this: any, options: any): string {

        const rootTemplateData = options.data.root;
        const parentComponent = rootTemplateData.component;

        const hash: Record<string, any> = options.hash;
        Object.entries(hash).forEach(([key, value]) => {

            if (key.startsWith("event:") && (value in parentComponent)) {

                const handlerKey = key.replace("event:", "");
                const handler = (parentComponent as any)[value];
                rootTemplateData.events[handlerKey] = handler;
            }
        });

        const component = new constructor({ props: options.hash });
        console.info(constructor, options);
        rootTemplateData.children[component.id] = component;


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
