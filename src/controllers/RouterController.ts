//import API, { AuthAPI, SigninData, SignupData } from '../api/AuthAPI';
import { PAGES_PATHS } from "../utils/Router";
import Router from "../utils/Router";
import store from "../utils/Store";
import { BlockConstructable, BlockProps, _Block } from "../utils/_Block";
import ChatsController from "./ChatsController";
//import MessagesController from './MessagesController';

export class RouterController {

    public use<T extends BlockProps = BlockProps>(pathname: string, block: BlockConstructable<T>): RouterController  {
        Router.use<T>(pathname, block);
        return this;
    }

    public go(path: string, quick?: boolean): void {
        
        if (!quick) path = this.getTrueRoute(path);

        Router.go(path); // если неизвестная startPage, то куда на 404?

        if (path === PAGES_PATHS.Messages) {
            ChatsController.fetchChats();
        }
    }
    
    public start(): void {
        const path = this.getTrueRoute(window.location.pathname);

        Router.start(path);
        
        if (path === PAGES_PATHS.Messages) {
            ChatsController.fetchChats();
        }
    }

    private getTrueRoute(path: string): string {
        const state = store.getState();
//if (type in MESSAGE_TYPE) {

//}
        const noUserPage = (path === PAGES_PATHS.Login || path === PAGES_PATHS.Sign);
        const noUser = !state.user;
  
        if (noUser) {
            if (!noUserPage) path = PAGES_PATHS.Login;
        }
        else {
            if (noUserPage) {
                path = PAGES_PATHS.Messages;
            }           
        }

        return path;
    }

    //ChatsController.fetchChats()

}

export default new RouterController();
