//import API, { AuthAPI, SigninData, SignupData } from '../api/AuthAPI';
import AuthController from "./AuthController";
import RouterController from "./RouterController";
//import MessagesController from './MessagesController';

export class IndexController {

    async start() {

        try {
            await AuthController.fetchUser();
        } catch (e) {

        }

        RouterController.start(); // если неизвестная startPage, то куда на 404?
    }

}

export default new IndexController();
