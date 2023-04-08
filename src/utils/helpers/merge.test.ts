import { expect } from "chai";
import { set } from "./merge";

describe.only("helpers - merge", () => {

    const keypath = "test";
    const value = "some value";
    const otherValue = "other value";

    let obj: Record<string, unknown>;

    beforeEach(() => {
        obj = {};
    });

    it("should set a value by keypath to the object", () => {

        set(obj, keypath, value);

        expect(obj).to.have.property(keypath, value);
    });

    it("should set a value by keypath to the object (nested)", () => {
        const path = "a.b.c";
        set(obj, path, value);

        expect(obj).to.have.nested.property("a.b.c", value);
    });

    it("should concatenate objects (nested)", () => {

        obj = { a: { b: { c1: otherValue } } };
        const path = "a.b.c";

        set(obj, path, value);

        expect(obj).to.have.nested.property("a.b.c1", otherValue);
    });
    
    it("should not merge arrays", () => {
        const arr1 = [1, 2, 3];
        const arr2 = [4, 5, 6];
        obj[keypath] = arr1;

        set(obj, keypath, arr2);

        expect(obj).to.have.property(keypath).deep.eq([...arr2]);
    });

    it("should return original object", () => {
        const result = set(obj, keypath, value);

        expect(result).to.equal(obj);
    });

    it("should return original object if it's is not an object", () => {
        const notAnObject = "string";

        const result = set(notAnObject, keypath, value);

        expect(result).to.eq(notAnObject);
    });

    it("should throw an error if path is not a string", () => {
        const keypathNotAString = 10;

        // @ts-ignore because we want to check behaviour in runtime
        const f = () => set(obj, keypathNotAString, value);

        expect(f).to.throw(Error);
    });

});
