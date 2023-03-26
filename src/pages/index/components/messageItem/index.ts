import { User } from "../../../../api/AuthAPI";
import { Message } from "../../../../controllers/MessagesController";
import { timeToStr } from "../../../../utils/helpers/dateToStr";
import { _Block } from "../../../../utils/_Block";
import template from "./index.hbs";
import * as styles from "./styles.module.pcss";

type Props = {
    item: Message, 
    userId: number, 
    scrollMessage?: Message,
    chatUsers: Map<number, User>
};

export default class MessageItem extends _Block<Props> {
    
    protected getCompileOptions() {
        return { 
            template, 
            styles,
            isMine: this.isMine.bind(this), 
            messageTime: this.getStrDate.bind(this),
            messOwner: this.getUser.bind(this)
        };
    }

    private getStrDate() {
        return timeToStr(new Date(this.getProps().item.time));
    }

    private isMine() {
        return this.getProps().userId === this.getProps().item.user_id;
    }

    private getUser() {
        const users = this.getProps().chatUsers;
        if (!users) return "";

        const message = this.getProps().item;
        const user = users.get(message.user_id);
        return user?.display_name || user?.first_name || message.user_id;
    }

    protected componentDidUpdate(_oldProps: Props, newProps: Props): boolean {

        this.scrollTo(newProps);
        return true;
    }

    protected componentDidMount() {
        this.scrollTo(this.getProps());
    }

    private scrollTo(props: Props) {
        
        if (props.scrollMessage && props.item.time === props.scrollMessage?.time) {
            this.getElement()?.scrollIntoView(true);
        }
    }
}

