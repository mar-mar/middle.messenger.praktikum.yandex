import { _Block } from '../../utils/_Block';
import template from './index.hbs';
import * as styles from "./styles.module.pcss";

type SimpleErrorProps = {
    error: string;
}

export default class SimpleError extends _Block<SimpleErrorProps> {

    protected getCompileOptions() {
        return { 
            template,
            styles
        };
    }
}
