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
        this.router = new Router("#app", this.getTrueRoute.bind(this));
    }

    public use(pathname: string, block: BlockConstructable): RouterController  {
        this.router.use(pathname, block);
        return this;
    }

    public go(path: string, quick?: boolean): void {

        this.router.go(path, quick); 

        if (this.router.getCurrentRoutePath() === PAGES_PATHS.Messages) {
            ChatsController.fetchChats();
        }
    }
    
    public start(): void {
        this.go(window.location.pathname);
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
