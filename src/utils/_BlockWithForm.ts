import Form from "../components/form";
import { EventBus } from "./EventBus";
import { isEvent } from "./helpers/typeCheck";
import { BlockProps, _Block } from "./_Block";
import SimpleError from "../components/simpleError";

export interface WithFormProps<D> extends BlockProps {
    onSubmit?: EventListener;
    execute?: (values?: D, errorCallback?: ErrorCallback) => void;
    error?: string | undefined;
}

const FORM_ATTACHE_NAME: string = "form";

enum FORM_EVENTS {
    ECEXUTE = "execute"
}

export type ErrorCallback = (error: string) => void;

export class _BlockWithForm<D = unknown, 
    T extends WithFormProps<D> = WithFormProps<D>> extends _Block<T> {

    protected getCompileOptions() {
        return {
            onSubmit: this.onSubmit.bind(this),
            FORM_ATTACHE_NAME
        };
    }

    protected reset() {
        
        const props: Partial<T> = {};
        props.error = undefined;
        this.setProps(props);
        super.reset();
    }

    protected registerLifeCycleEvents(eventBus: EventBus): void {
        super.registerLifeCycleEvents(eventBus);
        eventBus.on(FORM_EVENTS.ECEXUTE, this.execute.bind(this));
    }

    private onSubmit(evt: Event): void {
        if (!isEvent(evt)) return;
        evt.preventDefault();

        const form = this.getForm();
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
        
        if (execute) {
            execute(values, this.errorCallback.bind(this));
        }
    }

    componentDidUpdate(oldProps: Partial<T>, newProps: Partial<T>) {

        if (newProps.error !== oldProps.error) {

            this.getErrorBlock()?.setProps({ error: newProps.error });
            return false;
        }
        return true;
    }

    protected getErrorBlock(): SimpleError | null | undefined{
        return null;
    }

    protected errorCallback(error: string): void {

        this.getErrorBlock()?.setProps({ error });
    }

}

