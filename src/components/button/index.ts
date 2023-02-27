import { _Block, Props } from '../../utils/_Block';
import template from './index.hbs';
import styles from './styles.module.pcss';

interface ButtonProps extends Props {
    type?: string;
    label: string;
    onClick?: () => void;

    events?: {
        click: () => void;
    };
}


export default class Button extends _Block<ButtonProps> {

    protected render() {
        return this.compile(template, styles);
    }

    protected init() {
        console.log('input init');
        //this.getElement()!.classList.add(styles.button);
    }
}
