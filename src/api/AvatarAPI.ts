import HTTPTransport, { CONTENT_TYPE } from "../utils/transport/HTTPTransport";
import { User } from "./AuthAPI";
import _BaseAPI from "./_BaseAPI";

export interface AvatarData {
    avatar: File; 
}

export interface ChatAvatarData extends AvatarData {
    chatId: number;
}

export class AvatarUsersAPI extends _BaseAPI {
    constructor() {
        super(new HTTPTransport({ groupPath: "", contentType: CONTENT_TYPE.FORMDATA }))
    }

    // редактирование аватара
    userAvatar(data: AvatarData): Promise<User> {
        return this.http.put<User>("user/profile/avatar", { data });
    }

    chatAvatar(data: ChatAvatarData): Promise<User> {
        return this.http.put<User>("chats/avatar", { data });
    }
}

export default new AvatarUsersAPI();
