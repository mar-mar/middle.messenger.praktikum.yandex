import { isString } from "./helpers/typeCheck";
import { BlockProps, _Block } from "./_Block";
import SimpleError from "../components/simpleError";

export interface ValidatedBlockProps extends BlockProps {
    isValid: (value: unknown) => string;
    error?: string;
}

// базовый класс для компонентов
export class _ValidatedBlock<T extends ValidatedBlockProps = ValidatedBlockProps> extends _Block<T>{

    protected getCompileOptions() {
        return {
            ...super.getCompileOptions(),
            onBlurInput: this.onBlurInput.bind(this),
            onFocusInput: this.onFocusInput.bind(this)
        };
    }

    protected getValue(): unknown { return undefined; }


    protected onBlurInput(): void {
                
        this.validate();
    }

    protected onFocusInput(): void {
        
        this.validate();
    }


    public validate(): void {
        const isValid = this.getProps().isValid;
        if (!isValid) return;

        const errorBlock = this.getChildByAttacheNameOne("error") as SimpleError;
        const error = isValid(this.getValue());

        errorBlock?.setProps({ error: isString(error) ? error : "" });
    }

    public getError(): string {
        const errorBlock = this.getChildByAttacheNameOne("error") as SimpleError;
        return errorBlock?.getProps().error; 
    }
}

