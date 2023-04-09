import { isBlob, isObject } from "../helpers/typeCheck";

export enum METHODS {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE"
}

export enum CONTENT_TYPE {
    JSON = "json",
    FORMDATA = "formdata"
}

type Options = {
    headers?: Record<string, string>;
    timeout?: number;
    retries?: number;
    data?: PlainObject
}

type RequiredOptions = RequireKeys<Options, "headers" | "timeout" | "retries" > & { method: METHODS; }

type HTTPTransportOprions = {
    groupPath: string;
    contentType?: CONTENT_TYPE;
    apiURL?: string;
}

export default class HTTPTransport {
    private static defaultTimeout = 5000;
    private static withCredentials = true;
    private readonly groupPath: string;
    private readonly contentType: string;
    private readonly apiURL: string;

    constructor({ 
        groupPath, 
        contentType = CONTENT_TYPE.JSON, 
        apiURL = "https://ya-praktikum.tech/api/v2" } : HTTPTransportOprions) {

        this.apiURL = apiURL;
        this.groupPath = `${this.apiURL}/${groupPath}`;
        this.contentType = contentType;
    }

    public getURL(childPath: string): string {
        return this.groupPath + childPath;
    }

    public get<R>(path?: string, options?: Options): Promise<R> {

        return this.request<R>(METHODS.GET, path, options);
    }

    public put<R>(path?: string, options?: Options): Promise<R> {

        return this.request<R>(METHODS.PUT, path, options);
    }

    public post<R>(path?: string, options?: Options): Promise<R> {

        return this.request<R>(METHODS.POST, path, options);
    }

    public delete<R>(path?: string, options?: Options): Promise<R> {

        return this.request<R>(METHODS.DELETE, path, options);
    }


    private request<R>(method: METHODS, path: string = "", options?: Options): Promise<R> {
        options = options ?? {};


        return this._requestReq<R>(1, options.retries, path, {
            headers: options.headers || {},
            method: method || METHODS.GET,
            timeout: options.timeout || HTTPTransport.defaultTimeout,
            retries: options.retries || 1,
            data: options.data
        });
    }

    private _request<R>(path: string, options: RequiredOptions): Promise<R> {
        const data = options.data;
        

        let url = this.groupPath + (path ? "/" + path : "") ;

        return new Promise((resolve, reject) => {

            const xhr = new XMLHttpRequest();
            let withData = data && isObject(data);

            if (METHODS.GET === options.method && withData && data) {
                url += HTTPTransport.queryStringify(data);
                withData = false;
            }

            xhr.open(options.method, url);

            Object.entries(options.headers).forEach(([header, value]) => {
                xhr.setRequestHeader(header, value);
            });
            xhr.timeout = options.timeout;
            xhr.withCredentials = HTTPTransport.withCredentials;
            xhr.responseType = "json";

            // обработчики
            xhr.onload = () => {
                if (xhr.status < 400) {
                    resolve(xhr.response);
                } else {
                    reject(xhr.response);
                }
            };

            xhr.onabort = () => reject({ reason: "abort" });
            xhr.onerror = () => reject({ reason: "network error" });
            xhr.ontimeout = () => reject({ reason: "timeout" });

            // отправка
            this.send(xhr, withData ? data : undefined);
        })
    }

    private async _requestReq<R>(
        retryNumber: number,
        retries: number = 1,
        ...args: [url: string, options: RequiredOptions]): Promise<R> {

        let result;

        try {

            result = await this._request<R>(...args);

        }
        catch (exp) {

            if (retryNumber >= retries) throw exp;

            retryNumber += 1;
            result = await this._requestReq<R>(retryNumber, retries, ...args);
        }

        return result;
    }

    private static queryStringify(data: PlainObject) {
        // Можно делать трансформацию GET-параметров в отдельной функции
        let result = "";
        let symb = "?";

        Object.entries(data).forEach(([key, value]) => {

            result += `${symb}${key}=${value}`;
            symb = "&";
        });

        return result;
    }

    private send(xhr: XMLHttpRequest, data?: PlainObject): void {
        if (!data) {
            xhr.send();
            return;
        } 

        if (CONTENT_TYPE.JSON === this.contentType) {

            xhr.setRequestHeader("content-type", "application/json");
            xhr.send(JSON.stringify(data));
        }
        else if (CONTENT_TYPE.FORMDATA === this.contentType) {

            const formData = new FormData();
            
            Object.entries(data).forEach(([key, value]) => {
                
                formData.append(key, isBlob(value) ? value : String(value));
            });

            xhr.send(formData);
        }
    }
}


