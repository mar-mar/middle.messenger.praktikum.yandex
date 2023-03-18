import store from "../utils/Store";
import { errorLog } from "../utils/logger";
import API, { PasswordData, ProfileUserData, UsersAPI } from "../api/UsersAPI";
import AvatarAPI, { AvatarData, AvatarUsersAPI } from "../api/AvatarUsersAPI";
import ResourceAPI, { ResourceUserAPI } from "../api/ResourceUserAPI";
import Router, { PAGES_PATHS } from "../utils/Router";


export class UsersController {
    private readonly api: UsersAPI;
    private readonly avatarApi: AvatarUsersAPI;
    private readonly resourceApi: ResourceUserAPI;

    constructor() {
        this.api = API;
        this.avatarApi = AvatarAPI;
        this.resourceApi = ResourceAPI;
    }

    // изменить профиль
    async profile(data: ProfileUserData) {

        try {

            const user = await this.api.profile(data);
            store.set("user", user);

            Router.go(PAGES_PATHS.Messages);

        } catch (exp: any) {

            this.errorHandler(exp, true);
        }
    }

    // изменить аватар
    async avatar(data: AvatarData) {

        try {
            
            const user = await this.avatarApi.avatar(data);
            store.set("user", user);

        } catch (exp: any) {

            this.errorHandler(exp, true);
        }
    }

    // изменить пароль
    async password(data: PasswordData) {

        try {

            await this.api.password(data);

        } catch (exp: any) {

            this.errorHandler(exp, true);
        }
    }

    errorHandler(e: any, withThrow: boolean = false) {
        errorLog(e);
        if (withThrow) throw e?.reason || "Ошибка";
    }

    public getAvatarURL(path: string): string {
        return this.resourceApi.url(path);
    }

}

export default new UsersController();
