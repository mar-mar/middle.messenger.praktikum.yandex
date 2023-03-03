import Form from "../components/form";
import { log } from "./logger";
import routeUse from "./route";
import { isEvent } from "./typeCheck";
import { _Block } from "./_Block";

export type WithFormProps = {
    onSubmit: (value: any) => void;
};

export class _BlockWithForm<T extends WithFormProps> extends _Block<T> {

    protected getCompileOptions() {
        return {
            onSubmit: this.onSubmit.bind(this)
         };
    }

    private onSubmit(evt: Event): void {
        if (!isEvent(evt)) return;
        evt.preventDefault();

        let form = this.getForm();
        if (!this.isForm(form)) return;

        form.validate();

        if (!form.getError()) {

            log(form.getValues());
            routeUse("index");
        }
    }

    protected getForm(): Form | null {
        return null;
    }

    protected isForm(value: unknown): value is Form {
        return (value instanceof Form);
    }
}

