import { ChatInfo } from "../../../../api/ChatsAPI";
import ChatsController from "../../../../controllers/ChatsController";
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
            isSelected: selId && this.getProps().item.id === selId
        };
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

