import { ChatInfo } from "../../../../api/ChatsAPI";
import { withStore } from "../../../../utils/Store";
import { BlockProps, _Block } from "../../../../utils/_Block";
import template from "./index.hbs";
import styles from "./styles.module.pcss";


interface ChatListProps extends BlockProps {    
    openFindChat?: FunctionNoArgsNoReturn;

    storeItem: {
        chats: ChatInfo[];
    };
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
        chats: state.chats ? Object.values(state.chats).filter( m=> !!m) : []
    };
});

const ChatList = withChats(ChatListBase);
export default ChatList;
