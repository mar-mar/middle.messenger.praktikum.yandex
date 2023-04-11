import { expect } from "chai";
import { set } from "./merge";

describe("utils -> helpers -> merge.set", () => {

    const keypath = "test";
    const value = "some value";
    const otherValue = "other value";

    let obj: Record<string, unknown>;

    beforeEach(() => {
        obj = {};
    });

    it("должен установить значение согласно пути", () => {

        set(obj, keypath, value);

        expect(obj).to.have.property(keypath, value);
    });

    it("должен установить значение согласно вложенному пути", () => {
        const path = "a.b.c";
        set(obj, path, value);

        expect(obj).to.have.nested.property("a.b.c", value);
    });

    it("должен объединить объекты", () => {

        obj = { a: { b: { c1: otherValue } } };
        const path = "a.b.c";

        set(obj, path, value);

        expect(obj).to.have.nested.property("a.b.c1", otherValue);
    });
    
    it("должен не объединять массивы", () => {
        const arr1 = [1, 2, 3];
        const arr2 = [4, 5, 6];
        obj[keypath] = arr1;

        set(obj, keypath, arr2);

        expect(obj).to.have.property(keypath).deep.eq([...arr2]);
    });

    it("должен возвращать исходный объект", () => {
        const result = set(obj, keypath, value);

        expect(result).to.equal(obj);
    });

    it("должен возвращать первый параметр, если он не является объектом", () => {
        const notAnObject = "string";

        const result = set(notAnObject, keypath, value);

        expect(result).to.eq(notAnObject);
    });

    it("должен возвращать ошибку, если путь не является строкой", () => {
        const keypathNotAString = 10;

        // @ts-ignore because we want to check behaviour in runtime
        const f = () => set(obj, keypathNotAString, value);

        expect(f).to.throw(Error);
    });

});
