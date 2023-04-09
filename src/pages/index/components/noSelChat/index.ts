import { withStore } from "../../../../utils/Store";
import { BlockProps, _Block } from "../../../../utils/_Block";
import template from "./index.hbs";
import styles from "./styles.module.pcss";

interface Props extends BlockProps { 

    storeItem: {
        selectedChat: number | undefined;
    }
}

class NoSelChatBase extends _Block<Props> {
    
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
