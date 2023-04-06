import HTTPTransport, { CONTENT_TYPE } from "../utils/transport/HTTPTransport";

export default abstract class BaseAPI {
    protected http: HTTPTransport;

    protected constructor(endpoint: string, contentType: CONTENT_TYPE = CONTENT_TYPE.JSON) {
        this.http = new HTTPTransport(endpoint, contentType);
    }

    public create?(data: unknown): Promise<unknown>;

    public read?(identifier?: string | number): Promise<unknown>;

    public update?(identifier: string | number, data: unknown): Promise<unknown>;

    public delete?(identifier: string | number): Promise<unknown>;
}
