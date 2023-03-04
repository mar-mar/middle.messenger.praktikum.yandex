import { ValidatedBlockProps, _ValidatedBlock } from "../../utils/_ValidatedBlock";
import SimpleTextArea from "../simpleTextarea";
import template from './index.hbs';

type TextAreaProps = {
    label: string;
    value?: string;
    name?: string;
} & ValidatedBlockProps;

export default class TextArea extends _ValidatedBlock<TextAreaProps> {

    protected getCompileOptions() {
        return { 
            ...super.getCompileOptions(),
            template
        };
    }

    protected getValue(): any {
        const inputBlock = this.getChildByAttacheNameOne("input");
        if (!inputBlock) return null;

        return (inputBlock as SimpleTextArea).getValue();
    }
}
