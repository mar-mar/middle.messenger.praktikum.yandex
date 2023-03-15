import { _Block } from '../../../../utils/_Block';
import { WithFormProps, _BlockWithForm } from "../../../../utils/_BlockWithForm";
import template from './index.hbs';
import { validateName, validateLogin, validateEmail, validatePhone, validatePassword } from '../../../../utils/validate';
import * as styles from "./styles.module.pcss";
import { ERRORS } from "../../../../utils/validateErrors";
import Input from "../../../../components/input";


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
            validatePassword: this.validatePassword.bind(this),
            validateCopyPassword: this.validateCopyPassword.bind(this)
        };
    }

    private validatePassword(value: string): string {
        const result = validatePassword(value)
        this.getCopyPassword()?.validate();
        return result;
    }

    private validateCopyPassword(value: string): string {
        
        const firstPassword = this.getPassword();
        if (firstPassword?.getValue() !== value) {
            return ERRORS.passwordDiffError;
        }
        return "";
    }

    getPassword(): Input {
        return this.getForm()?.getChildByAttacheNameOne("inpPassword") as Input;
    }

    getCopyPassword(): Input {
        return this.getForm()?.getChildByAttacheNameOne("inpCopyPassword") as Input;
    }

}
