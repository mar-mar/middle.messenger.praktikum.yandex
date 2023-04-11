import HTTPTransport from "../utils/transport/HTTPTransport";
import _BaseAPI from "./_BaseAPI";

export interface AvatarData {
    avatar: File; //FileList
}


export class ResourceUserAPI extends _BaseAPI {
    constructor() {
        super(new HTTPTransport({ groupPath: "resources" }));
    }

    // редактирование аватара
    url(path: string): string {
        return this.http.getURL(path);
    }
}

export default new ResourceUserAPI();
