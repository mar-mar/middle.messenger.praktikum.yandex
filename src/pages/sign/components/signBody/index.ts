import { _Block } from '../../../../utils/_Block';
import { _BlockWithForm } from "../../../../utils/_BlockWithForm";
import template from './index.hbs';
import { validateName, validateLogin, validateEmail, validatePhone, validatePassword, validateCopyPassword } from '../../../../utils/validate';
import styles from "./styles.module.pcss";
import Input from "../../../../components/input";
import { SignupData } from "../../../../api/AuthAPI";
import AuthController from "../../../../controllers/AuthController";


export default class SignBody extends _BlockWithForm<SignupData> {

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

    async execute(values: SignupData) {
        if (!values) return;

        let error;
        try {
            await AuthController.signup(values as SignupData);
        }
        catch(exp) {
            error = exp;
        }

        const errorBlock = this.getChildByAttacheNameOne("error");
        errorBlock?.setProps({ error: String(error) });
    }

    private validatePassword(value: string): string {
        const result = validatePassword(value, )
        this.getCopyPassword()?.validate();
        return result;
    }

    private validateCopyPassword(value: string): string {
        
        return validateCopyPassword(this.getPassword()?.getValue() || "", value);
    }

    getPassword(): Input {
        return this.getForm()?.getChildByAttacheNameOne("inpPassword") as Input;
    }

    getCopyPassword(): Input {
        return this.getForm()?.getChildByAttacheNameOne("inpCopyPassword") as Input;
    }

}
