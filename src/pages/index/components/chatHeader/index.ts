import UsersController from "../../../../controllers/UsersController";
import { get } from "../../../../utils/helpers/merge";
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
    return {
        selectedChat: get(state, `chats.${state.selectedChatId}`)
    }
});


const ChatHeader = withChats(ChatHeaderBase);
export default ChatHeader;
