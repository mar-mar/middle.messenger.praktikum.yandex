import HTTPTransport from "../utils/transport/HTTPTransport";
import _BaseAPI from "./_BaseAPI";

export interface SigninData {
    login: string;
    password: string;
}

export interface SignupData {
    first_name: string;
    second_name: string;
    login: string;
    email: string;
    password: string;
    phone: string;
}

export interface User {
    id: number;
    first_name: string;
    second_name: string;
    login: string;
    email: string;
    password: string;
    phone: string;
    avatar: string;
    display_name: string;
}

export class AuthAPI extends _BaseAPI {
    constructor(http?: HTTPTransport) {
        http = http ?? new HTTPTransport({ groupPath: "auth" })
        super(http);
    }

    // вход
    signin(data: SigninData) {
        return this.http.post("signin", { data });
    }

    // регистрация
    signup(data: SignupData) {
        return this.http.post("signup", { data });
    }

    // данные по залогиневшемуся пользователю
    read(): Promise<User> {
        return this.http.get<User>("user");
    }

    // выход
    logout() {
        return this.http.post("logout");
    }
}

export default new AuthAPI();
