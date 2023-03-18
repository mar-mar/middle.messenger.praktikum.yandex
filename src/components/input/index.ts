import { _Block } from '../../utils/_Block';
import template from './index.hbs';
import * as styles from "./styles.module.pcss";
import { _ValidatedBlock } from "../../utils/_ValidatedBlock";
import SimpleInput from "../simpleInput";

type InputProps = {
    type?: string;
    name: string;
    value: string;
    label: string;
    accept?: string;

    parentClassName?: string;
    noMargin?: 1 |0;

};


export default class Input extends _ValidatedBlock<InputProps> {

    protected getCompileOptions() {
        return { 
            ...super.getCompileOptions(),
            template, 
            styles,
            type: "text"
        };
    }

    public getValue(): any {
        const inputBlock = this.getChildByAttacheNameOne("input");
        if (!inputBlock) return null;

        return (inputBlock as SimpleInput).getValue();
    }

}
