
import routeUse from "../../../../utils/route";
import { _Block } from '../../../../utils/_Block';
import template from './index.hbs';
import styles from './styles.module.pcss';

export default class ProfileBody extends _Block {

    protected getCompileOptions() {
        return { 
            template, 
            styles,
            onClickIndex: this.onClickIndex.bind(this),
            onClickError404: this.onClickError404.bind(this),
            onClickLogin: this.onClickLogin.bind(this)
        };
    }

    private onClickIndex(evt: Event): void {
        evt.preventDefault();

        routeUse("index");
    }

    private onClickError404(): void {
        routeUse("error404");
    }

    private onClickLogin(): void {
        routeUse("login");
    }


}
