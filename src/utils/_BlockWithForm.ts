import Form from "../components/form";
import { EventBus } from "./EventBus";
import { log } from "./logger";
import { isEvent, isFunction } from "./typeCheck";
import { _Block } from "./_Block";

export type WithFormProps = {
    onSubmit: (value: any) => void;
    execute: (values?: FormValues) => void
};

enum FORM_EVENTS {
    ECEXUTE = "execute"
};

export type FormValues = Record<string, unknown> | null;

export class _BlockWithForm<T extends WithFormProps> extends _Block<T> {

    protected getCompileOptions() {
        return {
            onSubmit: this.onSubmit.bind(this)
         };
    }

    protected registerLifeCycleEvents(eventBus: EventBus): void {
        super.registerLifeCycleEvents(eventBus);
        eventBus.on(FORM_EVENTS.ECEXUTE, this.execute.bind(this));
    }

    private onSubmit(evt: Event): void {
        if (!isEvent(evt)) return;
        evt.preventDefault();

        let form = this.getForm();
        if (!form) return;

        form.validate();

        if (!form.getError()) {
            const values = form.getValues();
            log(form.getValues());
            this.getEventBus().emit(FORM_EVENTS.ECEXUTE, { values });
        }
    }

    protected getForm(): Form | null {
        const form = this.getChildByAttacheNameOne("form");
        return this.isForm(form) ? form : null;
    }

    protected isForm(value: unknown): value is Form {
        return (value instanceof Form);
    }
    
    //
    protected execute(_values: FormValues) { 
        const execute = this.getProps().execute;
        if (isFunction(execute)) execute();
    }

}

