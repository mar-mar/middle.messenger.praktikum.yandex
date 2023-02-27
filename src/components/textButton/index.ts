import { _Block, Props } from '../../utils/_Block';
import template from './index.hbs';
import styles from './styles.module.pcss';

interface ButtonProps extends Props {
    type?: string;
    label: string;
    events: {
        click: () => void
    }
}


export default class TextButton extends _Block<ButtonProps> {

    protected render() {
        return this.compile(template, styles);
    }
}
