import routeUse from '../../utils/route';
import { _Block } from '../../utils/_Block';
import template from './index.hbs';
import styles from './styles.module.pcss';

export type ErrorPageLayoutProps = {
    errorCode?: string,
    message?: string
};


// базовый класс для компонентов
export default class ErrorPageLayout<T extends ErrorPageLayoutProps> extends _Block<T> {

    protected getCompileOptions() {
        return { 
            template, 
            styles,
            onClickIndex: this.onClickIndex.bind(this) 
        };
    }

    private onClickIndex(): void {
        routeUse("index");
    }
}
