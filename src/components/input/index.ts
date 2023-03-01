import { isFunction, isString } from "../../utils/typeCheck";
import { AnyFunctionNoReturn } from "../../utils/types";
import { _Block } from '../../utils/_Block';
import template from './index.hbs';
import styles from './styles.module.pcss';


interface InputProps {
    type?: string;
    key: string;
    label: string;
    required: boolean;
    isValid: (value: any) => string;
    error?: string;
    events?: {
        blur?: AnyFunctionNoReturn;
        focus?: AnyFunctionNoReturn;
    }
}


export default class Input extends _Block<InputProps> {

    protected getCompileOptions() {
        return { 
            template, 
            styles, 
            onBlurInput: this.onBlurInput.bind(this),
            onFocusInput: this.onFocusInput.bind(this)
        };
    }

    public getValue(): any {
        //!!!getchild
       // return this.getValueElement()?.value;
    }

    private onBlurInput(): void {
        debugger
        this.validate();
    }

    private onFocusInput(): void {
        debugger
        this.validate();
    }

    private validate(): void {
        const isValid = this.getProps().isValid;
        if (!isFunction(isValid)) return;


        const error = isValid(this.getValue());
        if (!error || !isString(error)) return;
        
        this.setProps({ error });
    }

    public componentDidUpdate(oldProps: InputProps, newProps: InputProps): boolean {
        
        if (oldProps.error !== newProps.error) {
debugger
            return false;
        }
        return true;
    }
    //isValid
    //validate
}
