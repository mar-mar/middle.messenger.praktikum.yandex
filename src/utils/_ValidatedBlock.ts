import { isFunction, isString } from "./typeCheck";
import { AnyFunctionNoReturn } from "./types";
import { _Block } from "./_Block";

export type ValidatedBlockProps = {
    isValid: (value: any) => string;
    error?: string;
    events?: {
        blur?: AnyFunctionNoReturn;
        focus?: AnyFunctionNoReturn;
    }
};

// базовый класс для компонентов
export class _ValidatedBlock<T extends ValidatedBlockProps> extends _Block<T> {

    protected getCompileOptions() {
        return {
            onBlurInput: this.onBlurInput.bind(this),
            onFocusInput: this.onFocusInput.bind(this)
         };
    }

    protected getValue(): any { return null; }

    protected onBlurInput(): void {
        
        this.validate();
    }

    protected onFocusInput(): void {
        
        this.validate();
    }

    public validate(): void {
        const isValid = this.getProps().isValid;
        if (!isFunction(isValid)) return;

        const errorBlock = this.getChildByAttacheNameOne("error");
        const error = isValid(this.getValue());

        errorBlock?.setProps({ error: isString(error) ? error : "" });
    }

    public getError() {
        const errorBlock = this.getChildByAttacheNameOne("error");
        return errorBlock?.getProps().error; 
    }
}

