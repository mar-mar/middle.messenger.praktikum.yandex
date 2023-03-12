import { isObject } from "./typeCheck";

export enum METHODS {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE'
};

type Options = {
    headers?: Record<string, string>;
    timeout?: number;
    retries?: number;
    method?: METHODS;
    data?: any
}

export default class HTTPTransport {
    static API_URL = 'https://ya-praktikum.tech/api/v2/'; //config
    private static defaultTimeout = 5000;
    private static defaultMethod = METHODS.GET;
    protected endpoint: string;

    constructor(endpoint: string) {
        this.endpoint = `${HTTPTransport.API_URL}${endpoint}`;
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
        return this._requestReq<R>(0, options.retries, url, options);
    }

    private _request<R>(url: string, options: Options): Promise<R> {
        let data = options.data;
        const headers = options.headers || {};
        const method = options.method || HTTPTransport.defaultMethod;
        const timeout = options.timeout || HTTPTransport.defaultTimeout;

        url = this.endpoint + url;

        return new Promise((resolve, reject) => {

            const xhr = new XMLHttpRequest();
            let withData = !!data;

            if (METHODS.GET === method && isObject(data)) {
                url += HTTPTransport.queryStringify(data);
                withData = false;
            }

            xhr.open(method, url);

            Object.entries(headers).forEach(([header, value]) => {
                xhr.setRequestHeader(header, value);
            });
            xhr.timeout = timeout;

            // обработчики
            xhr.onreadystatechange = () => {

                if (xhr.readyState === XMLHttpRequest.DONE) {
                    if (xhr.status < 400) {
                        resolve(xhr.response);
                    } else {
                        reject(xhr.response);
                    }
                }
            };

            xhr.onabort = () => reject({ reason: 'abort' });
            xhr.onerror = () => reject({ reason: 'network error' });
            xhr.ontimeout = () => reject({ reason: 'timeout' });

            // отправка
            if (withData) xhr.send(JSON.stringify(data));
            else xhr.send();
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
            retryNumber++;
            if (retryNumber > retries) throw new Error("Не удалось загрузить. " + exp);
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
}


