import { isHTMLTextAreaElement } from "../../utils/typeCheck";
import { _Block } from '../../utils/_Block';
import template from './index.hbs';
import styles from './styles.module.pcss';

export default class SimpleTextArea extends _Block {

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
