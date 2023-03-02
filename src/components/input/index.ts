import { _Block } from '../../utils/_Block';
import template from './index.hbs';
import styles from './styles.module.pcss';
import { AnyFunctionNoReturn } from "../../utils/types";
import { _ValidatedBlock } from "../../utils/_ValidatedBlock";
import SimpleInput from "../simpleInput";

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


export default class Input extends _ValidatedBlock<InputProps> {

    protected getCompileOptions() {
        return { 
            template, 
            styles, 
            onBlurInput: this.onBlurInput.bind(this),
            onFocusInput: this.onFocusInput.bind(this)
        };
    }

    protected getValue(): any {
        const inputBlock = this.getChildByAttacheNameOne("input");
        if (!inputBlock) return null;

        return (inputBlock as SimpleInput).getValue();
    }

}
