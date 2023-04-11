import store from "../utils/Store";
import logger from "../utils/logger";
import API, { PasswordData, ProfileUserData, SearchUserData, UsersAPI } from "../api/UsersAPI";
import AvatarAPI, { AvatarData, AvatarUsersAPI } from "../api/AvatarAPI";
import { PAGES_PATHS } from "../utils/Router";
import { get } from "../utils/helpers/merge";
import { isNumber } from "../utils/helpers/typeCheck";
import { User } from "../api/AuthAPI";
import RouterController from "./RouterController";

interface APIError {
    reason?: string;
    message?: string;
}

export class UsersController {
    private readonly api: UsersAPI;
    private readonly avatarApi: AvatarUsersAPI;

    constructor() {
        this.api = API;
        this.avatarApi = AvatarAPI;
    }

    getUser(): User | undefined {
        return store.getState().user;
    }

    getUserName(user: User) {
        return user.display_name || `${user.first_name} ${user.second_name}`;
    }

    // изменить профиль
    async profile(data: ProfileUserData) {

        try {

            const user = await this.api.profile(data);
            store.set("user", user);

            RouterController.go(PAGES_PATHS.Messages);

        } catch (exp: unknown) {

            this.errorHandler(exp, true);
        }
    }

    // изменить аватар
    async avatar(data: AvatarData) {

        try {
            
            const user = await this.avatarApi.userAvatar(data);
            store.set("user", user);

        } catch (exp: unknown) {

            this.errorHandler(exp, true);
        }
    }

    // изменить пароль
    async password(data: PasswordData) {

        try {

            await this.api.password(data);

        } catch (exp: unknown) {

            this.errorHandler(exp, true);
        }
    }

    async search(data: SearchUserData) {
        let user;
        try {

            user = await this.api.search(data);

        } catch (exp: unknown) {

            this.errorHandler(exp, true);
        }

        return user;
    }

    errorHandler(e: unknown, withThrow: boolean = false) {
        logger.errorLog(e);
        if (withThrow) {
            const error = (e as APIError);
            throw new Error(error?.reason ?? error?.message ?? "Ошибка");
        }
    }

    isCurrentUserId(id: number) {
        const currentId = get(store.getState(), "user.id")
        return (isNumber(currentId) && id === currentId);
    }
}

export default new UsersController();
