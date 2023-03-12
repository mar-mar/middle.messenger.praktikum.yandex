import { SignupData } from "../../api/AuthAPI";
import AuthController from "../../controllers/AuthController";
import routeUse, { PAGES } from "../../utils/route";
import { _Block } from "../../utils/_Block";
import { FormValues } from "../../utils/_BlockWithForm";
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

    private async executeLogin(values: FormValues) {
        if (!values) return;

        let error;
        try {
            await AuthController.signin(values as SignupData);
        }
        catch(exp) {
            error = exp;
        }

        const paneBlock = this.getChildByAttacheNameOne("pane");
        const errorBlock = paneBlock?.getChildByAttacheNameOne("error");
        errorBlock?.setProps({ error: String(error) });
        
    }


}
