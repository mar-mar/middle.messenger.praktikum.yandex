import { _Block } from '../../utils/_Block';
import template from './index.hbs';
import styles from './styles.module.pcss';

type TextButtonProps = {
    type?: string;
    label?: string;
    noLabel?: 0|1;
    red?: 0|1;
    iconClass?: string;
    events?: {
        click?: EventHandler
    }
}

export default class TextButton extends _Block<TextButtonProps> {

    protected getCompileOptions() {
        return { 
            template, 
            styles,
            type: "button" 
        };
    }
}
