//import API, { AuthAPI, SigninData, SignupData } from '../api/AuthAPI';
import { PAGES_PATHS } from "../utils/Router";
import API, { AuthAPI, SigninData, SignupData } from "../api/AuthAPI";
import store from "../utils/Store";
import { errorLog } from "../utils/logger";
import RouterController from "./RouterController";
import ChatsController from "./ChatsController";

//import MessagesController from './MessagesController';
//test-20230312-mar1@yandex.ru test-20230312-mar1 12345678D/12345678D1/12345678D2 Имя Фамилия
//test-20230312-mar2 12345678D
// test-20230312-mar3 12345678D3
// 
//withCredentials

interface APIError {
    reason?: string;
}

export class AuthController {
    private readonly api: AuthAPI;

    constructor() {
        this.api = API;
    }

    // вход
    async signin(data: SigninData) {

        try {
            await this.api.signin(data);

            await this.fetchUser();

            RouterController.go(PAGES_PATHS.Messages);
        } catch (exp: unknown) {
            this.errorHandler(exp, true);
        }
    }

    // регистрация
    async signup(data: SignupData) {
        try {

            await this.api.signup(data);
            
        } catch (exp: unknown) {
            this.errorHandler(exp, true);
        }

        await this.fetchUser();
        RouterController.go(PAGES_PATHS.Messages);
    }

    async fetchUser() {
        let user;
        
        try {
            user = await this.api.read();
        } catch (exp: unknown) {
            this.errorHandler(exp, true);
        }

        store.set("user", user);
    }

    async logout() {
        try {

            await this.api.logout();
            
            RouterController.go(PAGES_PATHS.Login, true);
            
            store.clear();
            ChatsController.closeAll();

        } catch (exp: unknown) {
            this.errorHandler(exp);
        }
    }

    errorHandler(e: unknown, withThrow: boolean = false) {
        errorLog(e);

        if (withThrow) throw new Error((e as APIError)?.reason || "Ошибка");
    }
}

export default new AuthController();
