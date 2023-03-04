import routeUse, { PAGES } from "../../utils/route";
import { _Block } from "../../utils/_Block";
import template from "./index.hbs";
import styles from './styles.module.pcss';

export default class LoginPage extends _Block {
    
    protected getCompileOptions() {
        return { 
            template,
            styles,
            goIndex: () => routeUse(PAGES.Index),
            goSing: () => routeUse(PAGES.Sign)
        };
    }
}
