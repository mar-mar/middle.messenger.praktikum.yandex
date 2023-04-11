import { isArray, isHTMLFormElement } from "../../utils/helpers/typeCheck";
import { BlockProps, _Block } from "../../utils/_Block";
import { _ValidatedBlock } from "../../utils/_ValidatedBlock";
import template from "./index.hbs";


interface FormProps extends BlockProps {
    events?: {
        submit?: DOMEventHandler;
    }
}

export default class Form extends _Block<FormProps> {

    protected getCompileOptions() {
        return { 
            template
        };
    }

    public validate(): void {
        this.forEachChildren((child: _Block) => {

            if (child instanceof _ValidatedBlock) {

                child.validate();
            }
        });
    }

    public getError(): string {

        const errors: string[] = [];
        this.forEachChildren((child: _Block) => {

            if (child instanceof _ValidatedBlock) {

                const error = child.getError();
                if (error) errors.push(error);
            }
        });

        return errors.join("|");
    }

    public getValues(): Record<string, unknown | unknown[]> | null {
        const element = this.getElement()
        if (!isHTMLFormElement(element)) return null;

        const formData = new FormData(element);
        const values: Record<string, unknown> = {};

        formData.forEach((value, key) => {
            const oldValue = values[key];
            if (key in values) {
                if (isArray(oldValue)) oldValue.push(value)
                else values[key] = [oldValue, value];
            }
            else values[key] = value;
        });
        
        return values;
    }

}
