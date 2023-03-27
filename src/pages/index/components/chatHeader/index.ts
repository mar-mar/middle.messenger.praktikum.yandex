import ResourceController from "../../../../controllers/ResourceController";
import { withStore } from "../../../../utils/Store";
import { _Block } from "../../../../utils/_Block";
import template from "./index.hbs";
import * as styles from "./styles.module.pcss";

type ChatHeaderProps = {
    openPopupChatMenu: FunctionNoArgsNoReturn
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

const ChatHeaderBase = withChats<ChatHeaderProps>(_Block);

export default class ChatHeader extends ChatHeaderBase {
    
    protected getCompileOptions() {
        return { 
            template, 
            styles,
            getAvatar: ()=> {
                return ResourceController.getResourceURL(this.getProps().item?.selectedChat?.avatar);
            },
            chatUsersStr: ()=> {
                
                const chatUsers = this.getProps().item?.chatUsers;
                if (!chatUsers) return;

                const users = Array.from(chatUsers.values());
                const srts = users.slice(0, 5).map(user => user.display_name)

                return srts.join(", ");
            }
        };
    }
}

