
import { ChatInfo } from "../../../../api/ChatsAPI";
import UsersController from "../../../../controllers/UsersController";
import { _Block } from "../../../../utils/_Block";
import template from "./index.hbs";
import * as styles from "./styles.module.pcss";

type ChatHeaderProps = {
    openPopupChatMenu: FunctionNoArgsNoReturn,
    item: ChatInfo
}
export default class ChatHeader extends _Block<ChatHeaderProps> {
    
    protected getCompileOptions() {
        return { 
            template, 
            styles,
            getAvatar: ()=> {
                return UsersController.getAvatarURL(this.getProps().item.avatar);
            }
        };
    }
}
