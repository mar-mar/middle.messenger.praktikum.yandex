import { Props, _Block } from '../../utils/_Block';
import template from './index.hbs';
import styles from './styles.module.pcss';

type PaneLayoutProps = {
    secBackColor?: 0|1;
    withBorder?: 0|1;
    withMarginTop?: 0|1;
    addeClassName?: string;
} & Props;


export default class PaneLayout extends _Block<PaneLayoutProps> {

    protected getCompileOptions() {
        return { template, styles };
    }

}
