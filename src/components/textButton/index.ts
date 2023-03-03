import { _Block } from '../../utils/_Block';
import template from './index.hbs';
import styles from './styles.module.pcss';

type TextButtonProps = {
    type?: string;
    label: string;
    events: {
        click: () => void
    }
}

export default class TextButton extends _Block<TextButtonProps> {

    protected getCompileOptions() {
        return { template, styles };
    }
}
