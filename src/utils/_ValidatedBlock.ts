import { isFunction, isString } from "./typeCheck";
import { Props, _Block } from "./_Block";

// базовый класс для компонентов
export class _ValidatedBlock<T extends Props> extends _Block<T> {

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

