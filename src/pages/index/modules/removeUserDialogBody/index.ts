import { _Block } from "../../../../utils/_Block";
import template from "./index.hbs";
import { _BlockWithForm } from "../../../../utils/_BlockWithForm";
import { validateLogin } from "../../../../utils/validate";
import ChatsController from "../../../../controllers/ChatsController";


export default class RemoveUserDialogBody extends _BlockWithForm<Record<string, any>> {

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

    async execute() {
        try {
            await ChatsController.deleteSelectedChat();
        }
        catch(exp) {
            //errorCallback(String(exp)); где показать???
            // делать модулку с вопросом???
            return;
        }
    }
}
