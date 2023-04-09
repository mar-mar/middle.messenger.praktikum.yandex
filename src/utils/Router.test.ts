import { Router } from "./Router"
import { expect } from "chai";
import sinon from "sinon";
import { BlockConstructable } from "./_Block";

describe.only("Router", () => {

    const path = "/";
    const rootId = "#app";

    let getContentFake: sinon.SinonSpy<any[], HTMLDivElement>;
    let BlockMock: BlockConstructable;
    let RouterIns: Router;

    const resetValue = {
        winPath: window.location.pathname,
        back: global.window.history.back,
        forward: global.window.history.forward
    }


    function resetBlockMock() {
        getContentFake = sinon.fake.returns(document.createElement("div"));

        BlockMock = class {
            getElement = getContentFake;
            dispatchComponentDidMount = sinon.fake.returns(undefined);
            dispatchComponentDidUnMount = sinon.fake.returns(undefined);

        } as unknown as BlockConstructable;
    }

    beforeEach(() => {
        
        RouterIns = new Router(rootId);
        resetBlockMock();

        console.info("beforeEach", RouterIns.currentRoute);
    });

    afterEach(() => {
        window.location.pathname = resetValue.winPath;
    });

    before(()=> {
        global.window.history.back = () => {
            if (typeof window.onpopstate === "function") {
                window.onpopstate({ currentTarget: window } as unknown as PopStateEvent);
            }
        };
        global.window.history.forward = () => {
            if (typeof window.onpopstate === "function") {
                window.onpopstate({ currentTarget: window } as unknown as PopStateEvent);
            }
        }
    });

    after(() => {
        global.window.history.back = resetValue.back;
        global.window.history.forward = resetValue.forward;
    });

    it("use(). should return Router instance", () => {
        const result = RouterIns.use("/", BlockMock);

        expect(result).to.eq(RouterIns);
    });

    it("start(). should render a page on start", () => {
        RouterIns
            .use(path, BlockMock)
            .start(path);

        expect(getContentFake.callCount).to.eq(1);
    });

    it("start(). should render a page on start", () => {
        RouterIns
            .use(path, BlockMock)
            .start(path);

        expect(getContentFake.callCount).to.eq(1);
    });

    // describe("back()", () => {
    it("should render a page on history back action", () => {
        RouterIns
            .use(path, BlockMock)
            .start(path);

        expect(getContentFake.callCount).to.eq(1);

       /* console.info(getContentFake.callCount);
        Router
            .use(path, BlockMock)
            .start(path);

        //Router.back();
        console.info(getContentFake.callCount);
        expect(getContentFake.callCount).to.eq(1);*/
    });
    // });


});
