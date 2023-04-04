import { withStore } from "../../../../utils/Store";
import { _Block } from "../../../../utils/_Block";
import template from "./index.hbs";
import styles from "./styles.module.pcss";

class NoSelChatBase extends _Block {
    
    protected getCompileOptions() {
        return { 
            template, 
            styles
        };
    }
}

const withChats = withStore(state  => {
    return {
        selectedChat: state.selectedChatId
    }
});


const NoSelChat = withChats(NoSelChatBase);
export default NoSelChat;
