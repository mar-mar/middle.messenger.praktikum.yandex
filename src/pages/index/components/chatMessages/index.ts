import { User } from "../../../../api/AuthAPI";
import { Message } from "../../../../controllers/MessagesController";
import { fillMap } from "../../../../utils/helpers/fill";
import { withStore } from "../../../../utils/Store";
import { _Block } from "../../../../utils/_Block";
import template from "./index.hbs";
import styles from "./styles.module.pcss";

type Props = {

    storeItem: {
        selectedChatId: number | undefined;
        userId: number | undefined;
        messages:  Message[];
        scrollMessage: Message[] | undefined;
        chatUsers: Map<number, User> | undefined;
    }
};


class ChatListBase extends _Block<Props> {
    
    protected getCompileOptions() {
        return { 
            template, 
            styles,
            messageGroups: this.messageToGroup(this.getProps().storeItem.messages)
        };
    }

 
    private messageToGroup(messages: Message[]) {
        if (!messages) return;

        const groups = new Map<string, Message[]>();
    
        messages.forEach(mess => {

            const date = new Date(mess.time);
            date.setHours(0,0,0);
            const key = date.toLocaleDateString();

            fillMap<string, Message>(groups, key, mess);

        });
        
        return [...groups.entries()];
    }
}

const withChats = withStore(state => {
    let messages: Message[] = [];
    let scrollMessage: Message[] | undefined = undefined;

    const selectedChatId = state.selectedChatId;   

    if (selectedChatId && state.messages) {
        const messState = state.messages[selectedChatId];

        messages = messState?.messages;
        scrollMessage = messState?.scrollMessage;
    }

    return {
        selectedChatId,
        userId: state.user?.id,
        messages,
        scrollMessage,
        chatUsers: state.selectedChatUsers
    }
});


const ChatList = withChats(ChatListBase);
export default ChatList;

