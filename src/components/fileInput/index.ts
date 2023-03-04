import { _Block } from '../../utils/_Block';
import template from './index.hbs';
import styles from './styles.module.pcss';

type FileInputProps = {
    label: string;
    events: {
        click: () => void
    }
}

export default class FileInput extends _Block<FileInputProps> {

    protected getCompileOptions() {
        return { 
            template, 
            styles
        };
    }
}
