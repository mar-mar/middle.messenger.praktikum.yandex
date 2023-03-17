import Form from "../components/form";
import { EventBus } from "./EventBus";
import { log } from "./logger";
import { isEvent, isFunction } from "./typeCheck";
import { _Block } from "./_Block";

export type WithFormProps = {
    onSubmit: (value: any) => void;
    execute?: (values?: FormValues) => void
};

enum FORM_EVENTS {
    ECEXUTE = "execute"
};

const FORM_ATTACHE_NAME: string = "form";

export type FormValues = Record<string, any> | null;


export function withForm<D extends RecordStrAny = any, T extends RecordStrAny = any>() {


        return class WithStore extends _Block {
 
            constructor(props: WithFormProps & T & { item: D }) {
                super(props);
            }

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

                    log(form.getValues());
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
                const execute = this.getProps().execute;
                if (isFunction(execute)) execute(values);
            }
        

        }
}


