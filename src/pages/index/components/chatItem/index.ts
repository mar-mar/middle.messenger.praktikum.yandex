import { ChatInfo } from "../../../../api/ChatsAPI";
import ChatsController from "../../../../controllers/ChatsController";
import { dateToStr } from "../../../../utils/helpers/dateToStr";
import { Props, _Block } from "../../../../utils/_Block";
import template from "./index.hbs";
import * as styles from "./styles.module.pcss";

type ChatItemProps = { 
    item: ChatInfo,
    selectedChatId: number
};

 export default class ChatItem extends _Block<ChatItemProps> {
    
    protected getCompileOptions() {
        const selId = this.getProps().selectedChatId;

        return { 
            template, 
            styles,
            isSelected: selId && this.getProps().item.id === selId,
            getStrDate: this.getStrDate.bind(this)
        };
    }

    private getStrDate() {
        const props = this.getProps();
        const time = props.item?.last_message?.time;
        return time ? dateToStr(new Date(time)) : "";
    }

    constructor(props: Props<ChatItemProps>) { 
        props.events = props.events || {};
        const id = props.item.id;

        props.events.click = () => { 
            ChatsController.selectChat(id); 
        }
        super(props);
    }

}

