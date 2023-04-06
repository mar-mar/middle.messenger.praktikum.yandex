import routeUse, { PAGES } from "../../utils/route";
import { _Block } from "../../utils/_Block";
import template from "./index.hbs";
import styles from "./styles.module.pcss";

export default class SignPage extends _Block {

    protected getCompileOptions() {
        return { 
            template,
            styles,
            goLogin: () => routeUse(PAGES.Login)
        };
    }
}

// проверить после логаута очищается или нет 
// и логин проверить на очистку


