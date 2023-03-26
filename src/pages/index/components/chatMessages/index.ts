import { Message } from "../../../../controllers/MessagesController";
import { fillMap } from "../../../../utils/helpers/fill";
import { withStore } from "../../../../utils/Store";
import { _Block } from "../../../../utils/_Block";
import template from "./index.hbs";
import * as styles from "./styles.module.pcss";

class ChatListBase extends _Block {
    
    protected getCompileOptions() {
        return { 
            template, 
            styles,
            messageGroups: this.messageToGroup(this.getProps().item.messages)
        };
    }

 
    private messageToGroup(messages: Message[]) {
        if (!messages) return new Map();

        const groups = new Map();
    
        messages.forEach(mess => {
    
            
            const date = new Date(mess.time);
            date.setHours(0,0,0);
            const key = date.toLocaleDateString();
            fillMap<string, Message>(groups, key, mess);
        });
        return groups;
    }
}

const withChats = withStore(state => {
    let messages: Message[] = [];
    let scrollMessage: Message | undefined = undefined;

    if (!state.selectedChatId || !state.messages) {
        return {};
    }

    const messState = state.messages[state.selectedChatId];
        messages = messState?.messages
        scrollMessage = messState?.scrollMessage;


    return {
        selectedChatId: state.selectedChatId,
        userId: state.user?.id,
        messages,
        scrollMessage,
        chatUsers: state.selectedChatUsers
    }
});


const ChatList = withChats(ChatListBase);
export default ChatList;

