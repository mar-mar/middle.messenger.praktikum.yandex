import { validatePassword, validateLogin } from "../../../../utils/validate";
import template from "./index.hbs";
import { _BlockWithForm } from "../../../../utils/_BlockWithForm";
import styles from "./styles.module.pcss";
import { SigninData } from "../../../../api/AuthAPI";
import SimpleError from "../../../../components/simpleError";


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
        return this.getForm()?.getChildByAttacheNameOne("error") as SimpleError;
    }

}
