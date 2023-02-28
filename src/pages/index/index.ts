//import routeUse from "../../utils/route";
import routeUse from "../../utils/route";
import { _Block } from "../../utils/_Block";
import template from "./index.hbs";
import * as styles from './styles.module.pcss';


export default class IndexPage extends _Block {
    //import  routeUse from "./utils/route";

    protected render() {
        return this.compile(template, styles);
    }

    onClickProfile() {
        routeUse("profile");
    }

    onClickLogin() {
        debugger
        routeUse("login");
    }

    onClickError404() {
        debugger
        routeUse("error404");
    }

    onClickError500() {
        routeUse("error500"); 
    }
}
