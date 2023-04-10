import Button from "./index";
import { expect } from "chai";
import sinon from "sinon";

describe.only("component button", () => {
    const label = "button label";

    it("должен выполнять рендер без ошибок", () => {
        new Button({ label });
    });

    it("dom элемент должен быть button", () => {
        const bt = new Button({ label });
        const element = bt.getElement();

        expect(element).to.be.instanceof(window.HTMLButtonElement)
    });

    it("должен обрабатывать click", () => {

        const spy = sinon.spy();

        const bt = new Button({ 
            label,
            events: {
                click: spy
            }
        });
        
        const element = bt.getElement();

        element?.click();

        expect(spy.calledOnce).to.eq(true);
    });

    it("должен устанавивать label", () => {
        const bt = new Button({ label });

        const element = bt.getElement();

        expect(element?.firstElementChild?.textContent).to.eq(label);
    });

    it("должен устанавивать type", () => {
        const type = "submit";
        const bt = new Button({ type, label });

        const element = bt.getElement();

        expect(element?.getAttribute("type")).to.eq(type);
    });

    it("по умолчанию type='button'", () => {
        const type = "button";
        const bt = new Button({ label });

        const element = bt.getElement();

        expect(element?.getAttribute("type")).to.eq(type);
    });
});
