import ResourceAPI, { ResourceUserAPI } from "../api/ResourceUserAPI";

export class ResourceController {
    
    private readonly resourceApi: ResourceUserAPI;

    constructor() {
        this.resourceApi = ResourceAPI;
    }

    public getAvatarURL(path?: string): string {
        return path ? this.resourceApi.url(path) : "";
    }

    public getResourceURL(path?: string): string {
        return path ? this.resourceApi.url(path) : "";
    }
    
}

export default new ResourceController();
