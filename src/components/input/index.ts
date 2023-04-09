import { _Block } from "../../utils/_Block";
import template from "./index.hbs";
import styles from "./styles.module.pcss";
import { ValidatedBlockProps, _ValidatedBlock } from "../../utils/_ValidatedBlock";
import SimpleInput from "../simpleInput";

interface InputProps extends ValidatedBlockProps {
    type?: string;
    name: string;
    value: string;
    label: string;
    accept?: string;

    parentClassName?: string;
    noMargin?: 1 |0;
    addedClassName?: string;
}


export default class Input extends _ValidatedBlock<InputProps> {

    protected getCompileOptions() {
        return { 
            ...super.getCompileOptions(),
            template, 
            styles,
            type: "text"
        };
    }

    public getValue(): string | undefined {
        const inputBlock = this.getChildByAttacheNameOne("input");
        if (!inputBlock) return undefined;

        return (inputBlock as SimpleInput).getValue();
    }

}
