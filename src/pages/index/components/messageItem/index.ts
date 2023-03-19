import { Message } from "../../../../controllers/MessagesController";
import { dateToStr } from "../../../../utils/helpers/dateToStr";
import { _Block } from "../../../../utils/_Block";
import template from "./index.hbs";
import * as styles from "./styles.module.pcss";

export default class MessageItem extends _Block<{ item: Message, selectedChatId: number }> {
    
    protected getCompileOptions() {
        return { 
            template, 
            styles,
            isMine: this.isMine.bind(this), 
            messageTime: this.getStrDate.bind(this) 
        };
    }

    getStrDate() {
        return dateToStr(new Date(this.getProps().item.time));
    }

    isMine() {
        return this.getProps().selectedChatId === this.getProps().item.user_id;
    }
}

