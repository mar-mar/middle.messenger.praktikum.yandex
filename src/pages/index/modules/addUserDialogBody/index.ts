import { _Block } from "../../../../utils/_Block";
import template from "./index.hbs";
import { _BlockWithForm } from "../../../../utils/_BlockWithForm";
import { SearchUserData } from "../../../../api/UsersAPI";
import { validateLogin } from "../../../../utils/validate";
import ChatsController from "../../../../controllers/ChatsController";

export default class AddUserDialogBody extends _BlockWithForm<SearchUserData> {

    protected getCompileOptions() {
        return {
            ...super.getCompileOptions(),
            template,
            validateLogin
         };
    }

    protected componentDidMount(/*oldProps*/): void { 
        this.setProps({ item: {} });
    };

    protected getErrorBlock() {
        return this.getForm()?.getChildByAttacheNameOne("error");
    }

    async execute(values: SearchUserData) {
        try {
            await ChatsController.addUserToSelectedChat(values);
        }
        catch(exp) {
            this.errorCallback(String(exp));
            return;
        }

        super.execute(values);

    }
}
