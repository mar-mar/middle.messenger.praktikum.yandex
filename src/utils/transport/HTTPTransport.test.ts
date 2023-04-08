import sinon, { SinonFakeXMLHttpRequest, SinonFakeXMLHttpRequestStatic } from "sinon";
import HTTPTransport, { CONTENT_TYPE } from "./HTTPTransport";
import { expect } from "chai";

describe("HTTPTransport", () => {
    let xhr: SinonFakeXMLHttpRequestStatic;
    let instance: HTTPTransport;
    const requests: SinonFakeXMLHttpRequest[] = [];
    const oldXMLHttpRequest = global.XMLHttpRequest;
    const groupPath = "test-groupPath";
    const apiURL = "test-apiURL";
    const path = "test-Path";

    before(() => {
        xhr = sinon.useFakeXMLHttpRequest();

        // @ts-ignore global
        global.XMLHttpRequest = xhr;
    });

    after(() => {

        // @ts-ignore global
        global.XMLHttpRequest = oldXMLHttpRequest;
        xhr.restore();
    });

    beforeEach(() => {
        xhr.onCreate = ((request: SinonFakeXMLHttpRequest) => {
            requests.push(request);
        });
    });

    afterEach(() => {
        requests.length = 0;
    });


    describe("should send the correct method in the request", () => {

        beforeEach(() => {
            instance = new HTTPTransport({ groupPath });
        });

        it(".get() should send GET request", () => {
            instance.get(path);

            const [request] = requests;

            expect(request.method).to.eq("GET");
        });

        it(".put() should send PUT request", () => {
            instance.put(path);

            const [request] = requests;

            expect(request.method).to.eq("PUT");
        });

        it(".post() should send POST request", () => {
            instance.post(path);

            const [request] = requests;

            expect(request.method).to.eq("POST");
        });

        it(".delete() should send DELETE request", () => {
            instance.delete(path);

            const [request] = requests;

            expect(request.method).to.eq("DELETE");
        });
    });

    describe("should send correct url in request", () => {

        beforeEach(() => {
            instance = new HTTPTransport({ groupPath, apiURL });
        });

        it("url = [apiURL, groupPath, path]", () => {
            instance.get(path);

            const [request] = requests;

            expect(request.url).to.eq(`${apiURL}/${groupPath}/${path}`);
        });

        it("url = [apiURL, endpoint]", () => {
            instance.get();

            const [request] = requests;

            expect(request.url).to.eq(`${apiURL}/${groupPath}`);
        });

        it("get. data to url", () => {
            const testData = { prop1: "123", prop2: 123 };
            instance.get(path, { data: testData });

            const [request] = requests;

            expect(request.url).to.eq(`${apiURL}/${groupPath}/${path}?prop1=123&prop2=123`);
        });

    });

    describe("should send correct content", () => {
        const testData = { prop1: "123", prop2: 123 };

        it("json content", () => {
            instance = new HTTPTransport({ groupPath, contentType: CONTENT_TYPE.JSON });
            instance.post(path, { data: testData });

            const [request] = requests;

            expect(request.requestBody).to.eq(JSON.stringify(testData));
        });

        it("formData content", () => {
            instance = new HTTPTransport({ groupPath, contentType: CONTENT_TYPE.FORMDATA });
            instance.post(path, { data: testData });
            const formData = new FormData();
            Object.entries(testData).forEach(([key, value]) => { formData.append(key, String(value)) });

            const [request] = requests;

            expect(request.requestBody).deep.eq(formData);
        });

    });

    describe("should send correct headers", () => {

        it("headers. json content", () => {
            instance = new HTTPTransport({ groupPath, contentType: CONTENT_TYPE.JSON });
            instance.post(path, { data: {}});

            const [request] = requests;

            expect(request.requestHeaders["content-type"]).to.match(/application\/json/i);
        });

        it("headers. no json content", () => {
            instance = new HTTPTransport({ groupPath, contentType: CONTENT_TYPE.FORMDATA });
            instance.post(path, { data: {}});

            const [request] = requests;

            expect(request.requestHeaders["content-type"]).to.not.match(/application\/json/i);
        });

    });

    describe("should correct props", () => {

        it("props. withCredentials", () => {
            instance.get();

            const [request] = requests;

            expect(request.withCredentials).true;
        });

    });

    describe("should correct retries", () => {


        it("props. retries = 1 and status = 200", async () => {

            const def = instance.get(path);

            const [request] = requests;
            request.respond(200, {}, "");

            let error;
            try {
                await def;
            }
            catch(exp) {
                error = exp;
            }

            expect(error).to.not.throw;
        });

        it("props. retries = 1 and error", async () => {

            const def = instance.get(path);

            const [request] = requests;
            request.error();

            let error;
            try {
                await def;
            }
            catch(exp) {
                error = exp;
            }

            expect(error).to.throw;
        });

    });

});
