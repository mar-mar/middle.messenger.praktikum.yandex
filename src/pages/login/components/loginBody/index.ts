import { validatePassword, validateLogin } from "../../../../utils/validate";
import { _Block } from "../../../../utils/_Block";
import template from "./index.hbs";
import { WithFormProps, _BlockWithForm } from "../../../../utils/_BlockWithForm";

export default class LoginBody<T extends WithFormProps>  extends _BlockWithForm<T> {

    protected getCompileOptions() {
        return {
            ...super.getCompileOptions(),
            template,
            validateLogin,
            validatePassword
         };
    }

    protected getForm() {
        const form = this.getChildByAttacheNameOne("form");
        return this.isForm(form) ? form : null;
    }
}
