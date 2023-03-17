//import API, { AuthAPI, SigninData, SignupData } from '../api/AuthAPI';
import router, { PAGES_PATHS } from '../utils/Router';
import API, { AuthAPI, SigninData, SignupData } from "../api/AuthAPI";
import store from "../utils/Store";
import { errorLog } from "../utils/logger";

//import MessagesController from './MessagesController';
//test-20230312-mar1@yandex.ru test-20230312-mar1 12345678D Имя Фамилия
//test-20230312-mar2 12345678D
// 
//withCredentials
export class AuthController {
    private readonly api: AuthAPI;

    constructor() {
        this.api = API;
    }

    // вход
    async signin(data: SigninData) {
        debugger;

        try {
            await this.api.signin(data);

            await this.fetchUser();

            router.go(PAGES_PATHS.Profile);
        } catch (exp: any) {
            this.errorHandler(exp, true);
        }
    }

    // регистрация
    async signup(data: SignupData) {
        try {
            await this.api.signup(data);

            await this.fetchUser();

            router.go(PAGES_PATHS.Profile);
        } catch (exp: any) {
            this.errorHandler(exp);
        }
    }

    async fetchUser() {
        const user = await this.api.read();

        store.set("user", user);
    }

    async logout() {
        try {
           // MessagesController.closeAll();

            await this.api.logout();

            router.go(PAGES_PATHS.Login);
        } catch (exp: any) {
            this.errorHandler(exp);
        }
    }

    errorHandler(e: any, withThrow: boolean = false) {
        errorLog(e);
        if (withThrow) throw e?.reason || "Ошибка";
    }
}

export default new AuthController();
