import UsersController from "../../../../controllers/UsersController";
import { withStore } from "../../../../utils/Store";
import { _Block } from "../../../../utils/_Block";
import template from "./index.hbs";
import * as styles from "./styles.module.pcss";

type ChatHeaderProps = {
    openPopupChatMenu: FunctionNoArgsNoReturn,
    item: any
}
class ChatHeaderBase extends _Block<ChatHeaderProps> {
    
    protected getCompileOptions() {
        return { 
            template, 
            styles,
            getAvatar: ()=> {
                return UsersController.getAvatarURL(this.getProps().item?.avatar);
            }
        };
    }
}

const withChats = withStore(state  => {
    let selectedChat = undefined;

    if (state.selectedChatId && state.chats) {
        selectedChat = state.chats[state.selectedChatId]
    }

    return { selectedChat };

});


const ChatHeader = withChats(ChatHeaderBase);
export default ChatHeader;
