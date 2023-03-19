import { _Block } from "../../../../utils/_Block";
import template from "./index.hbs";
import { _BlockWithForm } from "../../../../utils/_BlockWithForm";
import { SearchUserData } from "../../../../api/UsersAPI";


export default class AddUserDialogBody extends _BlockWithForm<SearchUserData> {

    protected getCompileOptions() {
        return {
            ...super.getCompileOptions(),
            template
         };
    }

    protected getErrorBlock() {
        return this.getForm()?.getChildByAttacheNameOne("error");
    }
}
