import { expect } from "chai";

import sinon from "sinon";
import { AuthAPI } from "../api/AuthAPI";
import { AuthController } from "./AuthController";
import { RouterController } from "./RouterController";
import ChatsController from "./ChatsController";
import store from "../utils/Store";

describe.only("controllers -> AuthController", () => {
    // RouterController шпионить
    // 
    const authAPIMock = {
        logout: sinon.stub(),
        signin: sinon.stub(),
        signup: sinon.stub(),
        read: sinon.stub()
    };
    const routeGoFake = sinon.stub();
    let contr: AuthController;

    const authAPI = {
        logout: authAPIMock.logout,
        signin: authAPIMock.signin,
        signup: authAPIMock.signup,
        read: authAPIMock.read
    } as unknown as AuthAPI;

    const router = {
        go: routeGoFake
    } as unknown as RouterController;
    
    beforeEach(() => {
        contr = new AuthController(authAPI, router);
    });

    afterEach(() => {
        authAPIMock.logout.reset();
        authAPIMock.signin.reset();
        authAPIMock.signup.reset();
        authAPIMock.read.reset();

        routeGoFake.reset();
    });

    it("signin должен вызывать api.signin", () => {
        contr.signin({} as any);

        expect(authAPIMock.signin.callCount).to.eq(1);
    });

    it("signup должен вызывать api.signup", () => {
        contr.signup({} as any);

        expect(authAPIMock.signup.callCount).to.eq(1);
    });

    it("logout должен вызывать api.logout", () => {
        contr.logout();

        expect(authAPIMock.logout.callCount).to.eq(1);
    });

    it("fetchUser должен вызывать api.get", () => {
        contr.fetchUser();

        expect(authAPIMock.read.callCount).to.eq(1);
    });
    
    it("signin должен вызывать RouterController.go", async () => {

        await contr.signin({} as any);

        expect(routeGoFake.callCount).to.eq(1);
    });

    it("signin должен вызывать fetchUser", async () => {

        const spy = sinon.spy(contr, "fetchUser");

        await contr.signin({} as any);

        expect(spy.calledOnce).to.eq(true);
    });
    
    it("signup должен вызывать RouterController.go", async () => {

        await contr.signup({} as any);

        expect(routeGoFake.callCount).to.eq(1);
    });

    it("signup должен вызывать fetchUser", async () => {

        const spy = sinon.spy(contr, "fetchUser");

        await contr.signup({} as any);

        expect(spy.calledOnce).to.eq(true);
    });

    it("logout должен вызывать RouterController.go", async () => {

        await contr.logout();

        expect(routeGoFake.callCount).to.eq(1);
    });
    
    it("logout должен вызывать ChatsController.closeAll", async () => {
        const spy = sinon.spy(ChatsController, "closeAll");   

        await contr.logout();

        expect(spy.calledOnce).to.eq(true);
    });
    
    it("logout должен вызывать store.clear", async () => {
        const spy = sinon.spy(store, "clear");   

        await contr.logout();

        expect(spy.calledOnce).to.eq(true);
    });

});
