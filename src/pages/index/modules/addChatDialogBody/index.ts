import { _Block } from "../../../../utils/_Block";
import template from "./index.hbs";
import { _BlockWithForm } from "../../../../utils/_BlockWithForm";
import { CreateChatData } from "../../../../api/ChatsAPI";
import { validateChatName } from "../../../../controllers/ValidateController";
import ChatsController from "../../../../controllers/ChatsController";

export default class AddChatDialogBody extends _BlockWithForm<CreateChatData, { item?: CreateChatData }> {

    protected getCompileOptions() {
        return {
            ...super.getCompileOptions(),
            template,
            validateChatName
         };
    }

    protected getErrorBlock() {
        return this.getForm()?.getChildByAttacheNameOne("error");
    }

    protected componentDidMount(/*oldProps*/): void { 
        this.setProps({ item: { title: "" } });
    };

    async execute(values: CreateChatData) {
        try {
            await ChatsController.create(values);
        }
        catch(exp) {
            this.errorCallback(String(exp));
            return;
        }

        super.execute(values);

    }
}
