import template from "./index.hbs";
import { WithFormProps, _BlockWithForm } from "../../../../utils/_BlockWithForm";
import { CreateChatData } from "../../../../api/ChatsAPI";
import { validateChatName } from "../../../../controllers/ValidateController";
import ChatsController from "../../../../controllers/ChatsController";
import SimpleError from "../../../../components/simpleError";

interface Props extends WithFormProps<CreateChatData> { 
    item?: CreateChatData;
}

export default class AddChatDialogBody extends _BlockWithForm<CreateChatData, Props> {

    protected getCompileOptions() {
        return {
            ...super.getCompileOptions(),
            template,
            validateChatName
        };
    }

    protected componentDidMount(/*oldProps*/): void { 
        this.setProps({ item: { title: ""} });
    }

    protected getErrorBlock() {
        return this.getForm()?.getChildByAttacheNameOne("error") as SimpleError;
    }

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
