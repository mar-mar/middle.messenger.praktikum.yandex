import Router from "./Router"
import { expect } from "chai";
import sinon from "sinon";
import { BlockConstructable } from "./_Block";

describe("utils -> Router", () => {
    const paths = ["/path1", "/path2", "/path3"];
    const path = "/";
    const rootId = "#app";

    let getElementFake: sinon.SinonSpy<any[], HTMLDivElement>;
    let dispatchComponentDidMountFake: sinon.SinonSpy;
    let dispatchComponentDidUnMountFake: sinon.SinonSpy;

    let BlockMock: BlockConstructable;
    let router: Router;
    let winMock: Window;

    function resetBlockMock() {
        getElementFake = sinon.fake.returns(document.createElement("div"));
        dispatchComponentDidMountFake = sinon.fake();
        dispatchComponentDidUnMountFake = sinon.fake();

        if (!BlockMock) {
            BlockMock = class {
                getElement = getElementFake;
                dispatchComponentDidMount = dispatchComponentDidMountFake;
                dispatchComponentDidUnMount = dispatchComponentDidUnMountFake;
    
            } as unknown as BlockConstructable;

        }
    }

    function resetWinMock() {
        winMock = {
            location: { pathname: path },
            history: {
                // @ts-ignore test
                back: () => { winMock.onpopstate(); },
                // @ts-ignore test
                forward: () => { winMock.onpopstate(); },
                pushState: () => {}
            },
            onpopstate: ()=> {}
        } as unknown as Window;
    }

    beforeEach(() => {
        resetWinMock();

        router = new Router(rootId, (path)=>path, winMock);
        resetBlockMock();
    });

    it("use(). use должен возвращать ссылку на себя (this)", () => {
        const result = router.use("/", BlockMock);

        expect(result).to.eq(result);
    });

    it("go(). должен делать рендер страницы", () => {
        router
            .use(path, BlockMock)
            .go(path);

        expect(getElementFake.callCount).to.eq(1);
    });

    describe("комбинации переходов", () => {

        beforeEach(()=> {
            router.use(path, BlockMock);

            paths.forEach(path => {
                router.use(path, BlockMock);
            })
        });
    
        it("должен делать dispatchComponentDidMount страницы столько же сколько render", () => {
            router.go(path);
            router.go(paths[0]);
            router.go(paths[1]);

            expect(getElementFake.callCount).to.eq(dispatchComponentDidMountFake.callCount);
        });

        it("должен делать dispatchComponentDidMount страницы столько же сколько render - 1", () => {
            router.go(path);
            router.go(paths[0]);

            expect(getElementFake.callCount-1).to.eq(dispatchComponentDidUnMountFake.callCount);
        });

        it("go(). рендер должен быть вызван для start и каждого go (при уникальных path)", () => {
            router.go(path);
            router.go(paths[0]);
            router.go(paths[1]);
            router.go(paths[2]);
            
            expect(getElementFake.callCount).to.eq(4);
        });

        it("go(). для двух подряд одинаковых go рендер вызывается один раз", () => {
            router.go(path);
            router.go(paths[0]);
            router.go(paths[0]);
            
            expect(getElementFake.callCount).to.eq(2);
        });

        it("go() + back(). рендер должен быть вызван для start, каждого go и back (при уникальных path)", () => {
            router.go(path);
            
            router.go(paths[0]);
            router.go(paths[1]);
            router.go(paths[2]);
            winMock.location.pathname = paths[1];
            
            router.back();
            
            expect(getElementFake.callCount).to.eq(5);
    
        });

        it("go() + back() + forward(). рендер должен быть вызван для start, каждого go, back, forward (при уникальных path)", () => {
            router.go(path);
            router.go(paths[0]);
            router.go(paths[1]);
            router.go(paths[2]);

            winMock.location.pathname = paths[1];
            router.back();
            
            winMock.location.pathname = paths[2];
            router.forward();

            expect(getElementFake.callCount).to.eq(6);
    
        });

    });
 
});
