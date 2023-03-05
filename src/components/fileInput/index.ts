import { _Block } from '../../utils/_Block';
import { ValidatedBlockProps, _ValidatedBlock } from "../../utils/_ValidatedBlock";
import template from './index.hbs';
import styles from './styles.module.pcss';

type FileInputProps = {
    label: string;
    events?: {
        click?: EventHandler
    }
} & ValidatedBlockProps

export default class FileInput extends _ValidatedBlock<FileInputProps> {

    protected getCompileOptions() {
        return { 
            ...super.getCompileOptions(),
            template, 
            styles
        };
    }
}
