//import API, { AuthAPI, SigninData, SignupData } from '../api/AuthAPI';
import { PAGES_PATHS } from '../utils/Router';
import Router from "../utils/Router";
import store from "../utils/Store";
import { _Block } from "../utils/_Block";
import ChatsController from "./ChatsController";
//import MessagesController from './MessagesController';

export class RouterController {

    public use(pathname: string, block: typeof _Block): RouterController  {
        Router.use(pathname, block);
        return this;
    }

    public go(path: string): void {

        path = this.getTrueRoute(path);
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

        const isOpenPage = (path === PAGES_PATHS.Login || path === PAGES_PATHS.Sign);
        const permOpenPage = !state.user;

        if (permOpenPage !== isOpenPage) {
            if (permOpenPage) {
                path = PAGES_PATHS.Login;
            }
            else {
                path = PAGES_PATHS.Messages;
            }
        }
        return path;
    }

    //ChatsController.fetchChats()

}

export default new RouterController();
