import Form from "../components/form";
import { EventBus } from "./EventBus";
import { isEvent, isFunction } from "./helpers/typeCheck";
import { _Block } from "./_Block";

export type WithFormProps<T> = {
    onSubmit: (value: any) => void;
    execute?: (values?: FormValues) => void,
    error?: string
} & T;

const FORM_ATTACHE_NAME: string = "form";

enum FORM_EVENTS {
    ECEXUTE = "execute"
};

export type ErrorCallback = (error: string) => void;

export type FormValues = Record<string, any> | null;

export class _BlockWithForm<D extends Record<string, any>, T extends RecordStrAny = any> extends _Block<WithFormProps<T>> {
    //protected formData: Partial<D> = {};

    /*rotected getDomEvents(): Events | undefined {
        return {
            ...super(),

        }
    }*/

    protected getCompileOptions() {
        return {
            onSubmit: this.onSubmit.bind(this),
            FORM_ATTACHE_NAME
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

            const values = form.getValues() as D;
           
            this.getEventBus().emit(FORM_EVENTS.ECEXUTE, values);
        }
    }

    protected getForm(): Form | null {
        const form = this.getChildByAttacheNameOne(FORM_ATTACHE_NAME);
        return this.isForm(form) ? form : null;
    }

    protected isForm(value: unknown): value is Form {
        return (value instanceof Form);
    }
    
    //
    protected execute(values: D): void { 
        if (!values) return;

        const execute = this.getProps().execute;
        
        if (isFunction(execute)) {
            execute(values, this.errorCallback.bind(this));
        }
    }

    componentDidUpdate(oldProps: Partial<WithFormProps<T>>, newProps: Partial<WithFormProps<T>>) {

        if (newProps.error !== oldProps.error) {

            this.getErrorBlock()?.setProps({ error: newProps.error });
            return false;
        }
        return true;
    }

    protected getErrorBlock(): _Block | null | undefined{
        return null;
    }

    private errorCallback(error: string): void {
        this.getErrorBlock()?.setProps({ error });
    }

}

