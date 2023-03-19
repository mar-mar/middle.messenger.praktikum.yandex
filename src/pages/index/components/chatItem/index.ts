import { ChatInfo } from "../../../../api/ChatsAPI";
import ChatsController from "../../../../controllers/ChatsController";
import { Props, _Block } from "../../../../utils/_Block";
import template from "./index.hbs";
import * as styles from "./styles.module.pcss";

type ChatItemProps = { 
    item: ChatInfo,
    selectedChat: number
};

 export default class ChatItemB extends _Block<ChatItemProps> {
    
    protected getCompileOptions() {
        return { 
            template, 
            styles,
            isSelected: this.getProps().item.id === this.getProps().selectedChat
        };
    }

    constructor(props: Props<ChatItemProps>) { 
        props.events = props.events || {};
        const id = props.item.id;
        props.events.click = () => { 
            debugger
            ChatsController.selectChat(id); 
        }
        super(props);
    }

}

