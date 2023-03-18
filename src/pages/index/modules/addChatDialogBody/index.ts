import { _Block } from "../../../../utils/_Block";
import template from "./index.hbs";
import { _BlockWithForm } from "../../../../utils/_BlockWithForm";
import { CreateChatData } from "../../../../api/ChatsAPI";

export default class AddChatDialogBody extends _BlockWithForm<CreateChatData> {

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
