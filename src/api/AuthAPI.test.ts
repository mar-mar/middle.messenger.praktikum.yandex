import { expect } from "chai";
import { AuthAPI } from "./AuthAPI";
import HTTPTransport from "../utils/transport/HTTPTransport";
import sinon from "sinon";

describe("api -> AuthAPI", () => {
    let api: AuthAPI;

    const executorPost = sinon.stub();//.returns(Promise);
    const executorGet = sinon.stub().returns(Promise);

    const HTTPTransportMock = {
        post: executorPost,
        get: executorGet
    } as unknown as HTTPTransport;
    
    beforeEach(() => {
        api = new AuthAPI(HTTPTransportMock);
    });

    afterEach(() => {
        executorPost.reset();
        executorGet.reset();
    });

    it("logout должен быть отправлен на post logout", () => {
        api.logout();

        expect(executorPost.getCall(0).args[0]).to.eq("logout");
    });

    it("signin должен быть отправлен на post signin", () => {
        api.signin({} as any);

        expect(executorPost.getCall(0).args[0]).to.eq("signin");
    });

    it("signup должен быть отправлен на post signup", () => {
        api.signup({} as any);

        expect(executorPost.getCall(0).args[0]).to.eq("signup");
    });


    it("read должен быть отправлен на get user", () => {
        api.read();

        expect(executorGet.getCall(0).args[0]).to.eq("user");
    });
});
