import { isObject } from "./typeCheck";

type Indexed<T = unknown> = {
    [key in string]: T;
};

function isEqual(a: Indexed, b: Indexed): boolean {
    return isEqualAny(a, b);
}

function isEqualObj(lhs: Indexed, rhs: Indexed): boolean {
    const keysl = Object.keys(rhs);
    const keys2 = Object.keys(rhs);
    if (isEqualStringArray(keysl, keys2)) return false;

    return keysl.some(key => {
        return isEqualAny(lhs[key], rhs[key]);
    });
}

/*function isEqualArray(lhs: Array, rhs: Array): boolean {
    if (lhs.length !== rhs.length) return false;

    if (isEqualStringArray(keysl, keys2)) return false;

    return keysl.some(key => {
        return isEqualAny(lhs[key], rhs[key]);
    });
}*/


function isEqualAny(lhs: any, rhs: any): any {
    const isObjL = isObject(lhs);
    const isObjR = isObject(rhs);

    if (isObjL !== isObjR)  return false;
    if (isObjL) {
        return isEqualObj(lhs, rhs);
    }
    return lhs === rhs;  
}

function isEqualStringArray(array1: string[], array2: string[]): boolean {
    return array1.length === array2.length &&
        isEqualSet(new Set(array1), new Set(array2));
}

function isEqualSet(xs: Set<string>, ys: Set<string>): boolean {
    return xs.size === ys.size && [...xs].every((x) => ys.has(x));
}

export default isEqual
