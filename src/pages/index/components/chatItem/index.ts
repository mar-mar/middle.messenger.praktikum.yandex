import { ChatInfo } from "../../../../api/ChatsAPI";
import ChatsController from "../../../../controllers/ChatsController";
import ResourceController from "../../../../controllers/ResourceController";
import { dateToStr } from "../../../../utils/helpers/dateToStr";
import { withStore } from "../../../../utils/Store";
import { BlockProps, _Block } from "../../../../utils/_Block";
import template from "./index.hbs";
import styles from "./styles.module.pcss";


interface ChatItemProps extends BlockProps {    
    chatItem: ChatInfo,
    storeItem: StoreItem
}

type StoreItem = {
    selectedChatId: number | undefined;
}

class ChatItemBase extends _Block<ChatItemProps> {
    
    protected getCompileOptions() {
        const selId = this.getProps().storeItem.selectedChatId;

        return { 
            template, 
            styles,
            isSelected: selId && this.getProps().chatItem.id === selId,
            getStrDate: this.getStrDate.bind(this),
            getAvatar: ()=> {
                return ResourceController.getResourceURL(this.getProps().chatItem.avatar);
            }
        };
    }

    private getStrDate() {
        const props = this.getProps();
        const time = props.chatItem.last_message?.time;
        return time ? dateToStr(new Date(time)) : "";
    }

    constructor(props: ChatItemProps) { 
        props.events = props.events || {};
        const id = props.chatItem.id;

        props.events.click = () => { 
            ChatsController.selectChat(id); 
        }
        super(props);
    }

    componentDidUpdate(oldProps: ChatItemProps, newProps: ChatItemProps): boolean { 

        if (oldProps.storeItem.selectedChatId !== newProps.storeItem.selectedChatId) {
            return (oldProps.chatItem.id === oldProps.storeItem.selectedChatId ||
                newProps.storeItem.selectedChatId === oldProps.chatItem.id);
        }
        
        return true;
    }

}

const withChats = withStore((state) => {

    return {
        selectedChatId: state.selectedChatId
    };
});

const ChatItem = withChats(ChatItemBase);
export default ChatItem;

