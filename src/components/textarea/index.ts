import { ValidatedBlockProps, _ValidatedBlock } from "../../utils/_ValidatedBlock";
import SimpleTextArea from "../simpleTextarea";
import template from "./index.hbs";


interface TextAreaProps extends ValidatedBlockProps { 
    label: string;
    value?: string;
    name?: string;
}

export default class TextArea<T extends TextAreaProps = TextAreaProps> extends _ValidatedBlock<T> {

    protected getCompileOptions() {
        return { 
            ...super.getCompileOptions(),
            template
        };
    }

    protected getValue(): string | undefined{
        const inputBlock = this.getChildByAttacheNameOne("input");
        if (!inputBlock) return undefined;

        return (inputBlock as SimpleTextArea).getValue();
    }

    public focus() {
        const inputBlock = this.getChildByAttacheNameOne("input");
        inputBlock?.getElement()?.focus();
    }
}
