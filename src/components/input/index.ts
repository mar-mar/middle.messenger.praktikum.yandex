import { _Block } from '../../utils/_Block';
import template from './index.hbs';
import styles from './styles.module.pcss';
import { ValidatedBlockProps, _ValidatedBlock } from "../../utils/_ValidatedBlock";
import SimpleInput from "../simpleInput";

type InputProps = {
    type?: string;
    name: string;
    value: string;
    label: string;
    noMargin?: 1 |0;
} & ValidatedBlockProps;


export default class Input extends _ValidatedBlock<InputProps> {

    protected getCompileOptions() {
        return { 
            ...super.getCompileOptions(),
            template, 
            styles,
            type: "text"
        };
    }

    protected getValue(): any {
        const inputBlock = this.getChildByAttacheNameOne("input");
        if (!inputBlock) return null;

        return (inputBlock as SimpleInput).getValue();
    }

}
