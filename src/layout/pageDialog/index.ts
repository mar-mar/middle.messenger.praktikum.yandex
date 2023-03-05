import { _Block } from '../../utils/_Block';
import template from './index.hbs';
import * as styles from "./styles.module.pcss";

type PageDialogeProps = {
    title: string;
};

export default class PageDialogeLayout extends _Block<PageDialogeProps> {

    protected getCompileOptions() {
        return { template, styles };
    }

}
