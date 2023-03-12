//import API, { AuthAPI, SigninData, SignupData } from '../api/AuthAPI';
import router, { PAGES_PATHS } from '../utils/Router';
import API, { AuthAPI, SigninData, SignupData } from "../api/AuthAPI";
import store from "../utils/Store";
//import MessagesController from './MessagesController';

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

            router.go(PAGES_PATHS.Profile);
        } catch (e: any) {
            console.error(e);
        }
    }

    // регистрация
    async signup(data: SignupData) {
        try {
            await this.api.signup(data);

            await this.fetchUser();

            router.go(PAGES_PATHS.Profile);
        } catch (e: any) {
            console.error(e.message);
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

            router.go(PAGES_PATHS.Index);
        } catch (e: any) {
            console.error(e.message);
        }
    }
}

export default new AuthController();
