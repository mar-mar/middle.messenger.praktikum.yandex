import { User } from "./AuthAPI";
import _BaseAPI from "./_BaseAPI";

export interface ProfileUserData {
    first_name: string,
    second_name: string,
    display_name: string,
    login: string,
    email: string,
    phone: string
  }

export interface PasswordData {
    oldPassword: string,
    newPassword: string
}

export interface SearchUserData {
    login: string,
}


export class UsersAPI extends _BaseAPI {
    constructor() {
        super("user");
    }

    // редактирование профиля
    profile(data: ProfileUserData): Promise<User> {
        return this.http.put<User>("profile", { data });
    }

    // редактирование пароля
    password(data: PasswordData) {
        return this.http.put<User>("password", { data });
    }

    search(data: SearchUserData) {
        return this.http.post<User[]>("search", { data });
    }

}

export default new UsersAPI();
