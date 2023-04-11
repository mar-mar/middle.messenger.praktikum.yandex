import HTTPTransport from "../utils/transport/HTTPTransport";

export default abstract class BaseAPI {
    protected http: HTTPTransport;

    protected constructor(http: HTTPTransport) {
        this.http = http;
    }
}
