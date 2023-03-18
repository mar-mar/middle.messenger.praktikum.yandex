import { _Block } from '../../utils/_Block';
import template from './index.hbs';
import * as styles from "./styles.module.pcss";

type PaneLayoutProps = {
    secBackColor?: 0|1;
    noBorder?: 0|1;
    addeClassName?: string;
};


export default class PaneLayout extends _Block<PaneLayoutProps> {

    protected getCompileOptions() {
        return { template, styles };
    }

}
