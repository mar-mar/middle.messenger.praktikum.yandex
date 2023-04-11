import { _Block } from "../../../../utils/_Block";
import template from "./index.hbs";
import { WithFormProps, _BlockWithForm } from "../../../../utils/_BlockWithForm";
import { validateCopyPassword, validatePassword } from "../../../../utils/validate";
import { PasswordData } from "../../../../api/UsersAPI";
import Input from "../../../../components/input";
import UsersController from "../../../../controllers/UsersController";
import SimpleError from "../../../../components/simpleError";

interface Props extends WithFormProps<PasswordData> { 
    oldPassword?: string;
    newPassword?: string;
}

export default class UpdatePasswordDialogBody extends _BlockWithForm<PasswordData, Props>  {

    protected getCompileOptions() {
        return {
            ...super.getCompileOptions(),
            template,
            validatePassword: this.validatePassword.bind(this),
            validateCopyPassword: this.validateCopyPassword.bind(this)
        };
    }

    protected componentDidMount(/*oldProps*/): void { 
        this.reset();
    }

    async execute(values: PasswordData) {
        if (!values) return;

        try {
            await UsersController.password(values);
        }
        catch (exp) {
            this.errorCallback(String(exp));
            return;
        }

        super.execute(values);
    }

    protected getErrorBlock() {
        return this.getForm()?.getChildByAttacheNameOne("error") as SimpleError;
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
