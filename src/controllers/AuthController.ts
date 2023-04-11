//import API, { AuthAPI, SigninData, SignupData } from '../api/AuthAPI';
import { PAGES_PATHS } from "../utils/Router";
import API, { AuthAPI, SigninData, SignupData } from "../api/AuthAPI";
import store from "../utils/Store";
import logger, { Logger } from "../utils/logger";
import RouterController, { RouterController as RouterControllerClass } from "./RouterController";
import ChatsController from "./ChatsController";


//test-20230312-mar1@yandex.ru test-20230312-mar1 12345678D/12345678D1/12345678D2 Имя Фамилия
//test-20230312-mar2 12345678D
// test-20230312-mar3 12345678D3

interface APIError {
    reason?: string;
    message?: string;
}

export class AuthController {
    private readonly api: AuthAPI;
    private readonly routerController: RouterControllerClass;
    private readonly logger: Logger;

    constructor(
        authAPI?: AuthAPI, 
        routerController?: RouterControllerClass,
        inLogger?: Logger) {

        this.api = authAPI ?? API;
        this.routerController = routerController ?? RouterController;
        this.logger = inLogger ?? logger;
    }

    // вход
    async signin(data: SigninData) {

        try {
            await this.api.signin(data);
            
            await this.fetchUser();
            
            this.routerController.go(PAGES_PATHS.Messages);

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
        this.routerController.go(PAGES_PATHS.Messages);
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
            
            this.routerController.go(PAGES_PATHS.Login, true);
            
            store.clear();
            ChatsController.closeAll();

        } catch (exp: unknown) {
            this.errorHandler(exp);
        }
    }

    private errorHandler(e: unknown, withThrow: boolean = false) {
        this.logger.errorLog(e);

        if (withThrow) {
            const error = (e as APIError);
            throw new Error(error?.reason ?? error?.message ?? "Ошибка");
        }
    }
}

export default new AuthController();
