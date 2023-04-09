import { User } from "../../../../api/AuthAPI";
import { ChatInfo } from "../../../../api/ChatsAPI";
import ResourceController from "../../../../controllers/ResourceController";
import UsersController from "../../../../controllers/UsersController";
import { withStore } from "../../../../utils/Store";
import { BlockProps, _Block } from "../../../../utils/_Block";
import template from "./index.hbs";
import styles from "./styles.module.pcss";


interface ChatHeaderProps<SP> extends BlockProps {    
    openPopupChatMenu: FunctionNoArgsNoReturn,
    storeItem: SP
}

type StoreItem = {
    selectedChat: ChatInfo | undefined;
    chatUsers: Map<number, User> | undefined;
}

class ChatHeaderBase extends _Block<ChatHeaderProps<StoreItem>> {
    
    override getCompileOptions() {
        
        return { 
            template, 
            styles,
            getAvatar: ()=> {
                return ResourceController.getResourceURL(this.getProps().storeItem?.selectedChat?.avatar);
            },
            chatUsersStr: ()=> {
                
                const chatUsers = this.getProps().storeItem?.chatUsers;
                if (!chatUsers) return;

                const users = Array.from(chatUsers.values());
                const srts = users.slice(0, 5).map(user => UsersController.getUserName(user))

                return srts.join(", ") + (users.length > 5 ? "..." : "");
            }
        };
    }
}

const withChats = withStore(state  => {
    let selectedChat;
    let chatUsers;

    if (state.selectedChatId && state.chats) {
        selectedChat = state.chats[state.selectedChatId];
        chatUsers = selectedChat ? state.selectedChatUsers : undefined;
    }

    return { 
        selectedChat,
        chatUsers
    };

});

const ChatHeader = withChats(ChatHeaderBase);

export default ChatHeader;
