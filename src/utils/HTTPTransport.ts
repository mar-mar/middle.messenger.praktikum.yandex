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
    private static defaultTimeout = 5000;
    private static defaultMethod = METHODS.GET;
 
    public get(url: string, options: Options = {}): Promise<XMLHttpRequest> {

        return this.request(url, { ...options, method: METHODS.GET });
    }

    public put(url: string, options: Options = {}): Promise<XMLHttpRequest> {

        return this.request(url, { ...options, method: METHODS.PUT });
    }

    public post(url: string, options: Options = {}): Promise<XMLHttpRequest> {

        return this.request(url, { ...options, method: METHODS.POST });
    }

    public delete(url: string, options: Options = {}): Promise<XMLHttpRequest> {

        return this.request(url, { ...options, method: METHODS.DELETE });
    }


    private request(url: string, options: Options): Promise<XMLHttpRequest>  {
        return this._requestReq(0, options.retries, url, options);
    }

    private _request(url: string, options: Options): Promise<XMLHttpRequest>  {
        let data = options.data;
        const headers = options.headers || {};
        const method = options.method || HTTPTransport.defaultMethod;
        const timeout = options.timeout || HTTPTransport.defaultTimeout;

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

            xhr.onloadend = () => resolve(xhr);
            xhr.ontimeout = reject;
            xhr.onerror = reject;
            xhr.onabort = reject;

            if (withData) xhr.send(JSON.stringify(data));
            else xhr.send();
        })
    };

    private async _requestReq(
        retryNumber: number, 
        retries: number = 1, 
        ...args: [url: string, options: Options]): Promise<XMLHttpRequest> {

        let result;

        try {
            result = await this._request(...args);
        }
        catch (exp) {
            retryNumber++;
            if (retryNumber > retries) throw new Error("Не удалось загрузить. " + exp);
            result = await this._requestReq(retryNumber, retries, ...args);
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


