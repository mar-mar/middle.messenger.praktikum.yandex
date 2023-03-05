import routeUse, { PAGES } from '../../utils/route';
import { _Block } from '../../utils/_Block';
import template from './index.hbs';
import styles from './styles.module.pcss';

export type ErrorPageLayoutProps = {
    errorCode?: string,
    message?: string
};


export default class ErrorPageLayout<T extends ErrorPageLayoutProps = any> extends _Block<T> {

    protected getCompileOptions() {
        return { 
            template, 
            styles,
            goIndex: () => routeUse(PAGES.Index),
        };
    }

}
