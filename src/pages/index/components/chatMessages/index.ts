

import { Message } from "../../../../controllers/MessagesController";
import { dateToStr } from "../../../../utils/helpers/dateToStr";
import { withStore } from "../../../../utils/Store";
import { _Block } from "../../../../utils/_Block";
import template from "./index.hbs";
import * as styles from "./styles.module.pcss";

class ChatListBase extends _Block {
    
    protected getCompileOptions() {
        return { 
            template, 
            styles
        };
    }

}

const withChats = withStore(state => {
    let messages: Message[] = [];

    if (state.selectedChatId) {
        messages = state.messages[state.selectedChatId] || [];
    }

    return {
        selectedChatId: state.selectedChatId,
        messages
    }
});


const ChatList = withChats(ChatListBase);
export default ChatList;

