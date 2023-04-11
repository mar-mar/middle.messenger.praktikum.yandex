import proxyquire from "proxyquire";
import { expect } from "chai";
import sinon from "sinon";
import { type _Block } from "./_Block"
import { EventBus } from "./EventBus";
import Handlebars from "handlebars";

const eventBusMock = {
    on: sinon.stub(),
    emit: sinon.stub()
}

const { _Block: Block } = proxyquire("./_Block", {

    "./EventBus": {
        EventBus: class extends EventBus {

            emit(event: string, ...args: any[]) {
                eventBusMock.emit(event, ...args);
                super.emit(event, ...args)
            }

            on(event: string, callback: any) {
                eventBusMock.on(event, callback);
                super.on(event, callback);
            }
        }
    }

}) as { _Block: typeof _Block };


describe("utils -> _Block [интеграционный] ", () => {
    const attachName = "test-attachName";
    const template = Handlebars.compile("<div></div>");

    const ComponentSimpleMock = class extends Block { 
        getCompileOptions() {
            return { template };
        }
    };
    

    const createComponentSimpleMock = function(props = {}) {
        return new ComponentSimpleMock({ attachName, ...props });
    }

    describe("eventBus emit", () => {
        let block: _Block;

        beforeEach(() => {
            block = createComponentSimpleMock();
        });

        it("при создании должен выкидывать событие flow:render event", () => {
            expect(eventBusMock.emit.calledWith("flow:render")).to.eq(true);
        });

        it("setProps должен выкидывать событие flow:render", () => {
            block.setProps({ attachName: "attachName-new" });

            expect(eventBusMock.emit.calledWith("flow:render")).to.eq(true);
        });
               
    });

    describe("eventBus on", () => {
        const stub = sinon.stub();

        afterEach(() => {
            stub.reset();
        });

        it("при создании должен вызывать init", () => {
            
            const ComponentMock = class extends Block {
                init() {  stub(); } 
            };
            new ComponentMock({ attachName });

            expect(stub.callCount).to.eq(1);
        });

        it("при создании должен вызывать registerLifeCycleEvents", () => {
            
            const ComponentMock = class extends Block {
                registerLifeCycleEvents() {  stub(); } 
            };
            new ComponentMock({ attachName });

            expect(stub.callCount).to.eq(1);
        });

        it("dispatchComponentDidUnMount должен вызывать componentDidMount", () => {
            
            const ComponentMock = class extends Block {
                componentDidMount = stub
            };
            const block = new ComponentMock({ attachName });

            block.dispatchComponentDidMount();

            expect(stub.callCount).to.eq(1);
        });

        it("dispatchComponentDidUnMount должен вызывать componentDidMount", () => {

            const ComponentMock = class extends Block {
                componentDidUnMount = stub
            };
            const block = new ComponentMock({ attachName });

            block.dispatchComponentDidUnMount();

            expect(stub.callCount).to.eq(1);
        });

        it("setProps должен вызывать componentDidUpdate", () => {

            const ComponentMock = class extends Block {
                componentDidUpdate = stub
            };
            const block = new ComponentMock({ attachName });

            block.setProps({ attachName: "attachName-new" });

            expect(stub.callCount).to.eq(1);
        });

        it("setProps должен вызывать событие flow:render и далее getCompileOptions", () => {

            const ComponentMock = class extends Block {
                getCompileOptions() {  
                    stub(); 
                    return super.getCompileOptions();
                } 
            };
            const block = new ComponentMock({ attachName });

            stub.reset();
            block.setProps({ attachName: "attachName-new" });

            expect(stub.callCount).to.eq(1);
        });

    });


    describe("c шаблоном", () => {
        
        let block: _Block;

        beforeEach(() => {
            block = createComponentSimpleMock();
        });

        it("getElement возвращает HTMLElement", () => {

            expect(block.getElement()).instanceOf(HTMLElement);
        });

        it("show устанавливает style.display=block", () => {
            block.show();

            expect(block.getElement()?.style).to.property("display", "block");
        });

        it("hide устанавливает style.display=none", () => {
            block.hide();

            expect(block.getElement()?.style).to.property("display", "none");
        });

        it("visibleChild false устанавливает style.display=none дочернему блоку", () => {

            const ComponentMock = class extends Block {
                testVisibleChild(visible: boolean, childName: string) {  
                    this.visibleChild(visible, childName);
                } 
            };
            const parentBlock = new ComponentMock({ attachName });

            parentBlock.addChild(block);
            parentBlock.testVisibleChild(false, block.getProps().attachName ?? "");

            expect(block.getElement()?.style).to.property("display", "none");
        });
    });

   // getElement ??? как-то передать шаблон? + Handlebars.compile(contents)  

    // toggleVisible this.element.style.display
    // visibleChild addChild + getChildByAttacheNameOne + element.style.display

});
