import { CONTENT_TYPE } from "../utils/transport/HTTPTransport";
import _BaseAPI from "./_BaseAPI";

export interface AvatarData {
    avatar: File; //FileList
}


export class ResourceUserAPI extends _BaseAPI {
    constructor() {
        super("resources", CONTENT_TYPE.FORMDATA);
    }

    // редактирование аватара
    url(path: string): string {
        return this.http.getURL(path);
    }
}

export default new ResourceUserAPI();
