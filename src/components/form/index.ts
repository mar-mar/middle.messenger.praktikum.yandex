import { isHTMLFormElement } from "../../utils/typeCheck";
import { AnyFunctionNoReturn } from "../../utils/types";
import { _Block } from '../../utils/_Block';
import { _ValidatedBlock } from "../../utils/_ValidatedBlock";
import template from './index.hbs';
import styles from './styles.module.pcss';


export type FormProps = {
    events?: {
        submit?: AnyFunctionNoReturn;
    }
}

export default class Form extends _Block<FormProps> {

    protected getCompileOptions(): any {
        return { 
            template, 
            styles 
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

    public getValues(): Record<string, unknown> | null {
        const element = this.getElement()
        if (!isHTMLFormElement(element)) return null;

        const formData = new FormData(element);
        const values: Record<string, unknown> = {};
        formData.forEach((value, key) => {
            values[key] = value;
        });
        return values;
    }

}
