import { CONTENT_TYPE } from "../utils/HTTPTransport";
import { User } from "./AuthAPI";
import _BaseAPI from './_BaseAPI';

export interface AvatarData {
    avatar: File; //FileList
}


export class AvatarUsersAPI extends _BaseAPI {
    constructor() {
        super('user', CONTENT_TYPE.FORMDATA);
    }

    // редактирование аватара
    avatar(data: AvatarData): Promise<User> {
        return this.http.put<User>('profile/avatar', { data });
    }
}

export default new AvatarUsersAPI();
