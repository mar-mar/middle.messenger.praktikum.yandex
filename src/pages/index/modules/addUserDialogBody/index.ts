import { _Block } from "../../../../utils/_Block";
import template from "./index.hbs";
import { _BlockWithForm } from "../../../../utils/_BlockWithForm";
import { SearchUserData } from "../../../../api/UsersAPI";
import { validateLogin } from "../../../../utils/validate";

export default class AddUserDialogBody extends _BlockWithForm<SearchUserData> {

    protected getCompileOptions() {
        return {
            ...super.getCompileOptions(),
            template,
            validateLogin
         };
    }

    protected getErrorBlock() {
        return this.getForm()?.getChildByAttacheNameOne("error");
    }

}
