
import { _BlockWithForm } from "../../../../utils/_BlockWithForm";
import template from "./index.hbs";
import * as styles from "./styles.module.pcss";
import { validateMessage } from "../../../../utils/validate";
import { SendMessageData } from "../../../../controllers/MessagesController";
import { withStore } from "../../../../utils/Store";
import ChatsController from "../../../../controllers/ChatsController";
import TextArea from "../../../../components/textarea";


type MessageInputProps = {
    openPopupAttache: FunctionNoArgsNoReturn,

    message: string,
    storeItem: {
        selectedChatId: number | undefined;
    }
};

class MessageInputBase  extends _BlockWithForm<SendMessageData, MessageInputProps> {   
    
    protected getCompileOptions() {
        return {
            ...super.getCompileOptions(),
            template,
            styles,
            validateMessage
         };
    }

    execute(values: SendMessageData) {

        const chatId = this.getSelectedChatId();
        if (!chatId) return;

        ChatsController.sendMessage(chatId, values.message);

        this.reset();
        
        const mess = this.getForm()?.getChildByAttacheNameOne("message");
        if (!mess) return;

        (mess as TextArea).focus();
    }

    private getSelectedChatId() {
        return this.getProps().storeItem.selectedChatId;
    }

}


const withChats = withStore((state) => {
    return {
        selectedChatId: state.selectedChatId
    };
});

const MessageInput = withChats(MessageInputBase);

export default MessageInput;
