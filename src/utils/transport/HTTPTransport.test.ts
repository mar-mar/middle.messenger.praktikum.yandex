import sinon, { SinonFakeXMLHttpRequest, SinonFakeXMLHttpRequestStatic } from "sinon";
import HTTPTransport from "./HTTPTransport";
import { expect } from "chai";

describe("HTTPTransport", () => {
    let xhr: SinonFakeXMLHttpRequestStatic;
    let instance: HTTPTransport;
    const requests: SinonFakeXMLHttpRequest[] = [];
    const oldXMLHttpRequest = global.XMLHttpRequest;
    const endpoint = "test-endpoint";
    const apiURL = "test-apiURL";

    before(() => {
        xhr = sinon.useFakeXMLHttpRequest();

        // @ts-ignore global
        global.XMLHttpRequest = xhr;

        xhr.onCreate = ((request: SinonFakeXMLHttpRequest) => {
            requests.push(request);
        });
    });

    after(() => {

        // @ts-ignore global
        global.XMLHttpRequest = oldXMLHttpRequest;
    });

    afterEach(() => {
        requests.length = 0;
    });


    describe("should send the correct method in the request", () => {

        beforeEach(() => {
            instance = new HTTPTransport(apiURL);
        });

        it(".get() should send GET request", () => {
            instance.get(endpoint);

            const [request] = requests;

            expect(request.method).to.eq("GET");
        });

        it(".put() should send PUT request", () => {
            instance.put(endpoint);

            const [request] = requests;

            expect(request.method).to.eq("PUT");
        });

        it(".post() should send POST request", () => {
            instance.post(endpoint);

            const [request] = requests;

            expect(request.method).to.eq("POST");
        });

        it(".delete() should send DELETE request", () => {
            instance.delete(endpoint);

            const [request] = requests;

            expect(request.method).to.eq("DELETE");
        });
    });

    describe("should send correct url in request", () => {

        beforeEach(() => {
            instance = new HTTPTransport(endpoint, undefined, apiURL);
        });

        it(".put() should send PUT request", () => {
            const added = "added"
            instance.get(added);

            const [request] = requests;

            expect(request.url).to.eq(`${apiURL}/${endpoint}/${added}`);
        });
    });
    /*it(".delete() should send request", () => {
        public get<R>(url: string, options: Options = {}): Promise<R> {

            return this.request<R>(url, { ...options, method: METHODS.GET });
        }
    });*/




});
