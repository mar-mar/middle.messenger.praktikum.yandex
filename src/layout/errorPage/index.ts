import routeUse from '../../utils/route';
import { _Block } from '../../utils/_Block';
import template from './index.hbs';
import styles from './styles.module.pcss';

export default class ErrorPageLayout extends _Block {

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
