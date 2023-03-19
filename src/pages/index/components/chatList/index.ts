

import { _Block } from "../../../../utils/_Block";
import template from "./index.hbs";
import * as styles from "./styles.module.pcss";

type ChatListProps = {
    openFindChat?: FunctionNoArgsNoReturn;
}
export default class ChatList extends _Block<ChatListProps> {
    
    protected getCompileOptions() {
        return { 
            template, 
            styles,
            selectChat: this.selectChat.bind(this)
        };
    }

    selectChat(evt: any) {
        console.info(evt);
        debugger;
    }
}
