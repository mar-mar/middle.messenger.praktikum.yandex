import { _Block } from '../../../../utils/_Block';
import { WithFormProps, _BlockWithForm } from "../../../../utils/_BlockWithForm";
import template from './index.hbs';
import { validateName, validateLogin, validateEmail, validatePhone, validatePassword } from '../../../../utils/validate';
import * as styles from "./styles.module.pcss";


export default class SignBody<T extends WithFormProps> extends _BlockWithForm<T> {

    protected getCompileOptions() {
        return { 
            ...super.getCompileOptions(),
            template,
            styles,
            validateName,
            validateLogin,
            validateEmail,
            validatePhone,
            validatePassword
        };
    }

}
