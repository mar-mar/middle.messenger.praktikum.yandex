import { _Block } from "../../../../utils/_Block";
import template from "./index.hbs";
import { _BlockWithForm } from "../../../../utils/_BlockWithForm";
import { validateCopyPassword, validatePassword } from '../../../../utils/validate';
import { PasswordData } from "../../../../api/UsersAPI";
import Input from "../../../../components/input";


export default class UpdatePasswordDialogBody extends _BlockWithForm<PasswordData, { item?: Partial<PasswordData> }> {

    protected getCompileOptions() {
        return {
            ...super.getCompileOptions(),
            template,
            validatePassword: this.validatePassword.bind(this),
            validateCopyPassword: this.validateCopyPassword.bind(this)
         };
    }

    protected componentDidMount(/*oldProps*/): void { 
        this.setProps({ item: {} });
    };

    /*async execute(values: PasswordData) {
        if (!values) return;

        let error = "";
        try {
            await UsersController.password(values);
        }
        catch(exp) {
            error = String(exp);
        }

        const errorBlock = this.getForm()?.getChildByAttacheNameOne("error");
        errorBlock?.setProps({ error });
    }
*/
    protected getErrorBlock() {
        return this.getForm()?.getChildByAttacheNameOne("error");
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
