//import routeUse from "../../utils/route";
import routeUse from "../../utils/route";
import { _Block } from "../../utils/_Block";
import template from "./index.hbs";
import * as styles from './styles.module.pcss';


export default class IndexPage extends _Block {

    protected getCompileOptions() {
        return { 
            template, 
            styles,
            onClickLogin: this.onClickLogin.bind(this),
            onClickSign: this.onClickSign.bind(this),
            onClickProfile: this.onClickProfile.bind(this),
            onClickError404: this.onClickError404.bind(this),
            onClickError500: this.onClickError500.bind(this),
        };
    }

    onClickLogin(): void {
        routeUse("login");
    }

    onClickSign(): void {
        routeUse("sign");
    }

    onClickProfile(): void {
        routeUse("profile");
    }

    onClickError404(): void {
        routeUse("error404");
    }

    onClickError500(): void {
        routeUse("error500"); 
    }
}
