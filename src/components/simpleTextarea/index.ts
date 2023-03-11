import { isHTMLTextAreaElement } from "../../utils/typeCheck";
import { _Block } from '../../utils/_Block';
import template from './index.hbs';
import * as styles from "./styles.module.pcss";

type SimpleTextAreaProps = {
    label: string;
    value?: string;
    name?: string;
    events?: {
        focus?: () => void;
        blur?: () => void;
    };
};

export default class SimpleTextArea extends _Block<SimpleTextAreaProps> {

    protected getCompileOptions() {
        return { 
            template,
            styles
        };
    }

    getValue() {
        const element = this.getElement();
        return isHTMLTextAreaElement(element) ? element.value : null;
    }
}
