import { _Block } from '../../utils/_Block';
import template from './index.hbs';
import styles from './styles.module.pcss';

type ButtonProps = {
    type?: string;
    label: string;
    onClick?: () => void;

    events?: {
        click: () => void;
    };
};


export default class Button extends _Block<ButtonProps> {

    protected getCompileOptions() {
        return { 
            template, 
            styles,
            type: "button" 
        };
    }

    protected init() {
        console.log('input init');
        //this.getElement()!.classList.add(styles.button);
    }
}
