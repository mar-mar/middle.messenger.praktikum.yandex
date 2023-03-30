import { isBlob, isObject } from "../helpers/typeCheck";

export enum METHODS {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE'
};

export enum CONTENT_TYPE {
    JSON = 'json',
    FORMDATA = 'formdata'
};

type Options = {
    headers?: Record<string, string>;
    timeout?: number;
    retries?: number;
    method?: METHODS;
    data?: Record<string, any>
}

export default class HTTPTransport {
    static API_URL = 'https://ya-praktikum.tech/api/v2'; //config
    private static defaultTimeout = 5000;
    private static defaultMethod = METHODS.GET;
    private static withCredentials = true;
    protected endpoint: string;

    constructor(endpoint: string, 
        protected readonly contentType: CONTENT_TYPE = CONTENT_TYPE.JSON, 
        ) {

        this.endpoint = `${HTTPTransport.API_URL}/${endpoint}/`;
    }

    public getURL(childPath: string): string {
        return this.endpoint + childPath;
    }

    public get<R>(url: string, options: Options = {}): Promise<R> {

        return this.request<R>(url, { ...options, method: METHODS.GET });
    }

    public put<R>(url: string, options: Options = {}): Promise<R> {

        return this.request<R>(url, { ...options, method: METHODS.PUT });
    }

    public post<R>(url: string, options: Options = {}): Promise<R> {

        return this.request<R>(url, { ...options, method: METHODS.POST });
    }

    public delete<R>(url: string, options: Options = {}): Promise<R> {

        return this.request<R>(url, { ...options, method: METHODS.DELETE });
    }


    private request<R>(url: string, options: Options): Promise<R> {
        return this._requestReq<R>(1, options.retries, url, options);
    }

    private _request<R>(url: string, options: Options): Promise<R> {
        let data = options.data;
        const headers = options.headers || {};
        const method = options.method || HTTPTransport.defaultMethod;
        const timeout = options.timeout || HTTPTransport.defaultTimeout;

        url = this.endpoint + url;

        return new Promise((resolve, reject) => {

            const xhr = new XMLHttpRequest();
            let withData = data && isObject(data);

            if (METHODS.GET === method && withData && data) {
                url += HTTPTransport.queryStringify(data);
                withData = false;
            }

            xhr.open(method, url);

            Object.entries(headers).forEach(([header, value]) => {
                xhr.setRequestHeader(header, value);
            });
            xhr.timeout = timeout;
            xhr.withCredentials = HTTPTransport.withCredentials;
            xhr.responseType = 'json';

            // обработчики
            xhr.onload = () => {
                if (xhr.status < 400) {
                    resolve(xhr.response);
                } else {
                    reject(xhr.response);
                }
            };

            xhr.onabort = () => reject({ reason: 'abort' });
            xhr.onerror = () => reject({ reason: 'network error' });
            xhr.ontimeout = () => reject({ reason: 'timeout' });

            // отправка
            this.send(xhr, withData ? data : null)
        })
    };

    private async _requestReq<R>(
        retryNumber: number,
        retries: number = 1,
        ...args: [url: string, options: Options]): Promise<R> {

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

    private static queryStringify(data: Record<string, any>) {
        // Можно делать трансформацию GET-параметров в отдельной функции
        let result = "";
        let symb = "?";
        Object.entries(data).forEach(([key, value]) => {

            result += `${symb}${key}=${value
                }`;
            symb = "&";
        });
        return result;
    }

    private send(xhr: XMLHttpRequest, data: any): void {
        if (!data) {
            xhr.send();
            return;
        } 

        if (CONTENT_TYPE.JSON === this.contentType) {

            xhr.setRequestHeader('content-type', 'application/json');
            xhr.send(JSON.stringify(data));
        }
        else if (CONTENT_TYPE.FORMDATA === this.contentType) {
            const formData = new FormData();
            
            Object.entries(data).forEach(([key, value]) => {
                
                formData.append(key, isBlob(value) ? value : String(value));
            })

            xhr.send(formData);

        }
        else {
            xhr.send(data);
        }
    }
}


