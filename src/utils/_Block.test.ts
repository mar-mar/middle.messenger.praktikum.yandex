import proxyquire from "proxyquire";
import { expect } from "chai";
import sinon from "sinon";
import { type _Block } from "./_Block"


describe("utils -> _Block", () => {
    const attachName = "test-attachName";
    const eventBusMock = {
        on: sinon.stub(),
        emit: sinon.stub()
    }

    const { _Block: Block } = proxyquire("./_Block", {
        "./EventBus": {
            EventBus: class {
                emit = eventBusMock.emit;
                on = eventBusMock.on;
            }
        }
    }) as { _Block: typeof _Block };

    const ComponentSimpleMock = class extends Block {};

    const createComponentSimpleMock = function(props = {}) {
        return new ComponentSimpleMock({ attachName, ...props });
    }


    afterEach(() => {
        eventBusMock.on.reset();
        eventBusMock.emit.reset();
    });

    describe("eventBus emit", () => {
        let block: _Block;

        beforeEach(() => {
            block = createComponentSimpleMock();
        });

        it("должен выкидывать событие init event при создании", () => {
            expect(eventBusMock.emit.calledWith("init")).to.eq(true);
        });

        it("dispatchComponentDidMount должен выкидывать событие flow:component-did-mount", () => {
            block.dispatchComponentDidMount();

            expect(eventBusMock.emit.calledWith("flow:component-did-mount")).to.eq(true);
        });

        it("dispatchComponentDidUnMount должен выкидывать событие flow:component-did-un-mount", () => {
            block.dispatchComponentDidUnMount();

            expect(eventBusMock.emit.calledWith("flow:component-did-un-mount")).to.eq(true);
        });

        it("show должен вызывать dispatchComponentDidMount", () => {
            block.show();

            expect(eventBusMock.emit.calledWith("flow:component-did-mount")).to.eq(true);
        });

        it("hide должен вызывать dispatchComponentDidUnMount", () => {
            block.hide();

            expect(eventBusMock.emit.calledWith("flow:component-did-un-mount")).to.eq(true);
        });

        it("reset должен выкидывать событие flow:render", () => {
            const ComponentMock = class extends Block {
                public testReset() { this.reset(); }
            };
            const block = new ComponentMock({}); 

            block.testReset();

            expect(eventBusMock.emit.calledWith("flow:render")).to.eq(true);
        });
    });

    describe("остальное", () => {
        let block: _Block;

        beforeEach(() => {
            block = createComponentSimpleMock();
        });

        it("getProps должен возвращать, то что передано в конструкторе", () => {
            const value = "getProp-test";

            block = createComponentSimpleMock({ attachName: value});
            
            expect(block.getProps()).to.property("attachName", value);
        });
        
        it("getProps должен возвращать, то что передано в setProps", () => {
            const value = "getProp-test";

            block = createComponentSimpleMock({ attachName: "123" });
            block.setProps({ attachName: value });
            
            expect(block.getProps()).to.property("attachName", value);
        });

    });

    describe("остальное", () => {
        let block: _Block;
        let childBlock: _Block;
        const childAttachName = "test-attachName-child";

        beforeEach(() => {
            block = createComponentSimpleMock();
            childBlock = createComponentSimpleMock({ attachName: childAttachName });
        });

        it("addChild + forEachChildren", () => {
            let isOk: boolean = false;

            block.addChild(childBlock);
            block.forEachChildren(child => {
                isOk = isOk || child === childBlock;
            });

            expect(isOk).to.eq(true);
        });

        it("addChild + getChildByAttacheName", () => {

            block.addChild(childBlock);
            const childs = block.getChildByAttacheName(childAttachName);

            expect(childs).to.contain(childBlock);
        });

        it("addChild + getChildByAttacheNameOne", () => {

            block.addChild(childBlock);
            const child = block.getChildByAttacheName(childAttachName);

            expect(child).to.eq(childBlock);
        });
    });

});
