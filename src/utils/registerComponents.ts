import Handlebars from "handlebars/dist/handlebars.runtime";
import { _Block } from "./_Block";
import { isFunction } from "./typeCheck";
import {AnyFunction} from "./types";

export function registerComponent<T extends _Block>(name: string, 
    constructor: new(options: any) => T): void { // todo options: any ??? как  правильно

    Handlebars.registerHelper(name, function (this: any, options: any): string {

        //const templateData = options.data.root;
        const events: Record<string, AnyFunction> = {};
        const props: Record<string, any> = { ...options.hash };

        Object.entries(props).forEach(([key, value]) => {

            if (key.startsWith("event:") && isFunction(value)) {

                const handlerKey = key.replace("event:", "");
                events[handlerKey] = value;
                delete props[key];
            }
        });

        const data = options.data;
        const addChild: (child: _Block) => void = data.root ? data.root.addChild : data.addChilToChild;
        props.events = events;
        const component = new constructor(props);
        addChild(component);
        

        let childsStr = "";
        if (options.fn) {
            childsStr = options.fn(this, { data: { addChilToChild: component.addChild.bind(component) }});
        }
        
        //if (isArray(parentChildren)) {
        //    parentChildren.push(component);
        // }

        return `<div data-id='${component.getId()}'>${childsStr}</div>`;
    });
}
