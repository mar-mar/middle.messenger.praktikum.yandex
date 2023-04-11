import sinon, { SinonFakeXMLHttpRequest, SinonFakeXMLHttpRequestStatic } from "sinon";
import HTTPTransport, { CONTENT_TYPE } from "./HTTPTransport";
import { expect } from "chai";

describe("utils -> transport -> HTTPTransport", () => {
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


    describe("должен отправить правильный метод в запросе", () => {

        beforeEach(() => {
            instance = new HTTPTransport({ groupPath });
        });

        it(".get() должен отправить метод GET", () => {
            instance.get(path);

            const [request] = requests;

            expect(request.method).to.eq("GET");
        });

        it(".put() должен отправить метод PUT", () => {
            instance.put(path);

            const [request] = requests;

            expect(request.method).to.eq("PUT");
        });

        it(".post() должен отправить метод POST", () => {
            instance.post(path);

            const [request] = requests;

            expect(request.method).to.eq("POST");
        });

        it(".delete() должен отправить метод DELETE", () => {
            instance.delete(path);

            const [request] = requests;

            expect(request.method).to.eq("DELETE");
        });
    });

    describe("должен отправить правильный URL в запросе", () => {

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

    describe("должен отправить правильный корректный content", () => {
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

    describe("должен отправить правильные headers", () => {

        it("headers. contentType = json", () => {
            instance = new HTTPTransport({ groupPath, contentType: CONTENT_TYPE.JSON });
            instance.post(path, { data: {}});

            const [request] = requests;

            expect(request.requestHeaders["content-type"]).to.match(/application\/json/i);
        });

        it("headers. contentType <> json", () => {
            instance = new HTTPTransport({ groupPath, contentType: CONTENT_TYPE.FORMDATA });
            instance.post(path, { data: {}});

            const [request] = requests;

            expect(request.requestHeaders["content-type"]).to.not.match(/application\/json/i);
        });

    });

    describe("должны быть корректные параметры xhr", () => {

        it("withCredentials true", () => {
            instance.get();

            const [request] = requests;

            expect(request.withCredentials).true;
        });

    });

    describe("должен обрабатывать ответы", () => {


        it("должен обработать json ответ с кодом 200", async () => {
            const sendResponse = { response: "response - text" };

            const def = instance.get(path);

            const [request] = requests;
            request.respond(200, {}, JSON.stringify(sendResponse));

            const response: any = await def;
            
            expect(response.response).to.eq(sendResponse.response);
        });

        it("должен выкинуть исключение для 401 статуса с пришедшей ошибкой", async () => {
            const sendResponse = { response: "response - error" };
            const def = instance.get(path);

            const [request] = requests;
            request.respond(401, {}, JSON.stringify(sendResponse));

            let error: any;
            try {
                await def;
            }
            catch(exp) {
                error = exp;
            }

            expect(error.response).to.eq(sendResponse.response);
        });

    });

});
