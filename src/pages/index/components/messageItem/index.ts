import { User } from "../../../../api/AuthAPI";
import { Message } from "../../../../controllers/MessagesController";
import UsersController from "../../../../controllers/UsersController";
import { timeToStr } from "../../../../utils/helpers/dateToStr";
import { _Block } from "../../../../utils/_Block";
import template from "./index.hbs";
import styles from "./styles.module.pcss";

type Props = {
    storeItem: Message, 
    userId: number, 
    scrollMessage?: Message[],
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
        return timeToStr(new Date(this.getProps().storeItem.time));
    }

    private isMine() {
        return this.getProps().userId === this.getProps().storeItem.user_id;
    }

    private getUser() {
        const users = this.getProps().chatUsers;
        if (!users) return "";

        const message = this.getProps().storeItem;
        const user = users.get(message.user_id);
        return user ? UsersController.getUserName(user) : "";
    }

    protected componentDidUpdate(_oldProps: Props, newProps: Props): boolean {

        this.scrollTo(newProps);
        return true;
    }

    protected componentDidMount() {
        this.scrollTo(this.getProps());
    }

    private scrollTo(props: Props) {

        const scrollMessage = props.scrollMessage?.[0];

        if (scrollMessage && props.storeItem.time === scrollMessage.time) {
            this.getElement()?.scrollIntoView(true);
        }
    }
}

