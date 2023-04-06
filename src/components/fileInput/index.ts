import { isHTMLInputElement } from "../../utils/helpers/typeCheck";
import { _Block } from "../../utils/_Block";
import { ValidatedBlockProps, _ValidatedBlock } from "../../utils/_ValidatedBlock";
import SimpleInput from "../simpleInput";
import template from "./index.hbs";
import styles from "./styles.module.pcss";

type FileInputProps = {
    label: string;
    value?: string;
    name?: string;
    accept?: string;
    addedClassName?: string;

    events?: {
        change?: EventHandler // onchange всплывает
    }
} & ValidatedBlockProps

export default class FileInput extends _ValidatedBlock<FileInputProps> {

    protected getCompileOptions() {
        return { 
            ...super.getCompileOptions(),
            template, 
            styles
        };
    }

    public getValue(): any {
        const inputBlock = this.getChildByAttacheNameOne("input");
        if (!inputBlock) return null;

        const input = (inputBlock as SimpleInput).getElement();
        if (isHTMLInputElement(input)) {
            return input.files?.[0];
        }
        
        return null;
    }
}
