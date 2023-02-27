import { _Block } from '../../utils/_Block';
import template from './index.hbs';
import styles from './styles.module.pcss';


interface InputProps {
    type?: string;
    label: string;
    events: {
        click: () => void;
    };
}


export default class Input extends _Block<InputProps> {

    render() {
        return this.compile(template, styles);
    }

    getValue() {
        return (this.getElement() as HTMLInputElement).value;
    }

}
