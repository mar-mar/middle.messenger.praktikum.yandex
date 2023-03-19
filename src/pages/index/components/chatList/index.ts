

import { get } from "../../../../utils/helpers/merge";
import { withStore } from "../../../../utils/Store";
import { _Block } from "../../../../utils/_Block";
import template from "./index.hbs";
import * as styles from "./styles.module.pcss";

type ChatListProps = {
    openFindChat?: FunctionNoArgsNoReturn;
    item: any;
}

class ChatListBase extends _Block<ChatListProps> {
    
    protected getCompileOptions() {
        return { 
            template, 
            styles
        };
    }

}


const withChats = withStore((state) => {

    return {
        chats: state.chats ? Object.values(state.chats) : [],
        selectedChatId: state.selectedChatId
    };
});

const ChatList = withChats(ChatListBase);
export default ChatList;
