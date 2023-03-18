import { SigninData } from "../../api/AuthAPI";
import AuthController from "../../controllers/AuthController";
import routeUse, { PAGES } from "../../utils/route";
import { _Block } from "../../utils/_Block";
import { ErrorCallback } from "../../utils/_BlockWithForm";
import template from "./index.hbs";
import * as styles from "./styles.module.pcss";

export default class LoginPage extends _Block {
    
    protected getCompileOptions() {
        return { 
            template,
            styles,
            executeLogin: this.executeLogin.bind(this),
            goSing: () => routeUse(PAGES.Sign)
        };
    }

    private async executeLogin(values: SigninData, errorCallback: ErrorCallback) {

        try {
            await AuthController.signin(values);
        }
        catch(exp) {
            errorCallback(String(exp));
        }        
    }


}
