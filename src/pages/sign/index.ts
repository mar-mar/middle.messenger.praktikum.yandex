import { _Block } from "../../utils/_Block";
import template from "./index.hbs";
import styles from "./styles.module.pcss";
import RouterController from "../../controllers/RouterController";
import { PAGES_PATHS } from "../../utils/Router";

export default class SignPage extends _Block {

    protected getCompileOptions() {
        return { 
            template,
            styles,
            goLogin: () => RouterController.go(PAGES_PATHS.Login)
        };
    }
}

