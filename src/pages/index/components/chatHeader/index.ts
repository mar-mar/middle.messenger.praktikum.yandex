
import { _Block } from "../../../../utils/_Block";
import template from "./index.hbs";
import styles from './styles.module.pcss';

type ChatHeaderProps = {
    openPopupChatMenu: FunctionNoArgsNoReturn
}
export default class ChatHeader extends _Block<ChatHeaderProps> {
    
    protected getCompileOptions() {
        return { template, styles };
    }
}
