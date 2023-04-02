import { _Block } from "../../../../utils/_Block";
import template from "./index.hbs";
import { _BlockWithForm } from "../../../../utils/_BlockWithForm";
import * as styles from "./styles.module.pcss";
import ChatsController from "../../../../controllers/ChatsController";
import { ChatInfo } from "../../../../api/ChatsAPI";
import { validateChatName } from "../../../../controllers/ValidateController";

type SearchData = {
    filter: string;
};

type Props = {
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
    };

    protected getErrorBlock() {
        return this.getForm()?.getChildByAttacheNameOne("error");
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
