import { expect } from "chai";
import { merge } from "./merge";

describe("helpers - merge", () => {
    const testObj1 = { a: 1, b: 1 };
    const testObj2 = { a: 3 };

    

    const testObj12 = { a: 3, b: 1 };
    
    const simpleValue = "123";


    it.only("merge. two object", () => {
        const result = merge(testObj1, testObj2);

        expect(result).deep.eq(testObj12);
    });

    it.only("merge. object and simple value", () => {
        const result = merge(testObj1, simpleValue);

        expect(result).deep.eq(simpleValue);
    });

    it.only("merge. result === first param ", () => {
        const result = merge(testObj1, testObj2);

        expect(result).eq(testObj1);
    });

    it.only("merge. two object. with array props", () => {
        const testObj3 = { a: [1, 2], b: 2 };
        const testObj4 = { a: [3, 4] };
        const testObj34 = { a: [3, 4], b: 2 };

        const result = merge(testObj3, testObj4);

        expect(result).deep.eq(testObj34)
    });

    it.only("merge. two array", () => {
        const arr1 = [ 1, 2, { a: 1 }, 5 ];
        const arr2 = [ 3, 4, { b: 1 } ];

        const result = merge(arr1, arr2);

        expect(result).deep.eq(arr2)
    });

   /* it("set", () => {
    });*/

});
