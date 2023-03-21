
import { _BlockWithForm } from "../../../../utils/_BlockWithForm";
import template from "./index.hbs";
import * as styles from "./styles.module.pcss";
import { validateMessage } from "../../../../utils/validate";
import { SendMessageData } from "../../../../controllers/MessagesController";
import { withStore } from "../../../../utils/Store";
import ChatsController from "../../../../controllers/ChatsController";


type MessageInputProps = {
    openPopupAttache: FunctionNoArgsNoReturn,
    item: any
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
        ChatsController.sendMessage(this.getSelectedChatId(), values.message);
    }

    private getSelectedChatId() {
        return this.getProps().item.selectedChatId;
    }

}


const withChats = withStore((state) => {
    return {
        selectedChatId: state.selectedChatId
    };
});

const MessageInput = withChats(MessageInputBase);

export default MessageInput;
