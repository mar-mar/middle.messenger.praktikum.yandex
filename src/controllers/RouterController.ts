//import API, { AuthAPI, SigninData, SignupData } from '../api/AuthAPI';
import { PAGES_PATHS } from "../utils/Router";
import Router from "../utils/Router";
import store from "../utils/Store";
import { BlockConstructable } from "../utils/_Block";
import ChatsController from "./ChatsController";
//import MessagesController from './MessagesController';

export class RouterController {
    router: Router;

    constructor() {
        this.router = new Router("#app");
    }

    public use(pathname: string, block: BlockConstructable): RouterController  {
        this.router.use(pathname, block);
        return this;
    }

    public go(path: string, quick?: boolean): void {
        
        if (!quick) path = this.getTrueRoute(path);

        this.router.go(path); // если неизвестная startPage, то куда на 404?

        if (path === PAGES_PATHS.Messages) {
            ChatsController.fetchChats();
        }
    }
    
    public start(): void {
        const path = this.getTrueRoute(window.location.pathname);

        this.router.start(path);
        
        if (path === PAGES_PATHS.Messages) {
            ChatsController.fetchChats();
        }
    }

    private getTrueRoute(path: string): string {
        const state = store.getState();

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

}

export default new RouterController();
