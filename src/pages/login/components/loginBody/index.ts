import { validatePassword, validateLogin } from "../../../../utils/validate";
import { _Block } from "../../../../utils/_Block";
import template from "./index.hbs";
import { _BlockWithForm } from "../../../../utils/_BlockWithForm";
import * as styles from "./styles.module.pcss";
import { SigninData } from "../../../../api/AuthAPI";


export default class LoginBody  extends _BlockWithForm<SigninData> {

    protected getCompileOptions() {
        return {
            ...super.getCompileOptions(),
            template,
            styles,
            validateLogin,
            validatePassword
         };
    }
    
    protected getErrorBlock() {
        return this.getForm()?.getChildByAttacheNameOne("error");
    }

}
