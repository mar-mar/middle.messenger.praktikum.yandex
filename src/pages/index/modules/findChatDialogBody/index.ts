import template from "./index.hbs";
import { WithFormProps, _BlockWithForm } from "../../../../utils/_BlockWithForm";
import styles from "./styles.module.pcss";
import ChatsController from "../../../../controllers/ChatsController";
import { ChatInfo } from "../../../../api/ChatsAPI";
import { validateChatName } from "../../../../controllers/ValidateController";
import SimpleError from "../../../../components/simpleError";

type SearchData = {
    filter: string;
};

interface Props extends WithFormProps<SearchData> { 
    chats?: ChatInfo[];
    item?: SearchData;
    withResult?: boolean;
}

export default class FindChatDialogBody extends _BlockWithForm<SearchData, Props> {

    protected getCompileOptions() {
        return {
            ...super.getCompileOptions(),
            template,
            styles,
            selectChat: this.selectChat.bind(this),
            validateChatName
        };
    }

    protected componentDidMount(/*oldProps*/): void { 
        this.setProps({ item: undefined, chats: undefined, withResult: false });
    }

    protected getErrorBlock() {
        return this.getForm()?.getChildByAttacheNameOne("error") as SimpleError;
    }

    async execute(values: SearchData) {

        let chats;
        try {
            chats = await ChatsController.seachChats(values.filter);
        }
        catch(exp) {
            this.errorCallback(String(exp));
            return;
        }

        this.setProps({ chats, item: { filter: values.filter }, withResult: true });
        
    }
    

    private async selectChat(evt: Event) {
        const chatId = parseFloat((evt.currentTarget as HTMLElement).dataset?.id || "");

        if (chatId) {
            await ChatsController.fetchChats();
            ChatsController.selectChat(chatId);
            super.execute({ filter: this.getProps().item?.filter || "" });
        }
    }
}
