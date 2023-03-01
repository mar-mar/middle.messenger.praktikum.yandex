import { ERRORS } from "../../../../utils/errors";
import routeUse from "../../../../utils/route";
import { isEvent } from "../../../../utils/typeCheck";
import { _Block } from "../../../../utils/_Block";
import template from "./index.hbs";

export default class LoginBody extends _Block {

    protected getCompileOptions() {
        return {
            template,
            onClickIndex: this.onClickIndex.bind(this),
            validateForm: this.validateForm.bind(this),
            validateLogin: this.validateLogin.bind(this),
            validatePassword: this.validatePassword.bind(this)
         };
    }

    private onClickIndex(evt: Event): void {
        if (!isEvent(evt)) return;
        evt.preventDefault();

        routeUse("index");
    }


    private validateForm() {

    }

    private validateLogin() {
        return ERRORS.loginEmpty;
    }

    private validatePassword() {

    }
}
