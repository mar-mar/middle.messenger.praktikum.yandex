import { validatePassword, validateLogin } from "../../../../utils/validate";
import { _Block } from "../../../../utils/_Block";
import template from "./index.hbs";
import { WithFormProps, _BlockWithForm } from "../../../../utils/_BlockWithForm";
import styles from './styles.module.pcss';

export default class LoginBody<T extends WithFormProps>  extends _BlockWithForm<T> {

    protected getCompileOptions() {
        return {
            ...super.getCompileOptions(),
            template,
            styles,
            validateLogin,
            validatePassword
         };
    }
}
