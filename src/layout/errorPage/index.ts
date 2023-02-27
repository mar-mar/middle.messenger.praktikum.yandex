import { _Block } from '../../utils/_Block';
import template from './index.hbs';
import styles from './styles.module.pcss';

export default class ErrorPageLayout extends _Block {

    protected render() {
        return this.compile(template, styles);
    }

}
