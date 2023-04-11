import { isArray, isMap, isObject } from "./typeCheck";


function isEqual(a: unknown, b: unknown): boolean {
    return isEqualAny(a, b);
}

function isEqualObj(lhs: PlainObject, rhs: PlainObject): boolean {
    const keysl = Object.keys(rhs);
    const keys2 = Object.keys(rhs);
    if (!isEqualStringArray(keysl, keys2)) return false;

    return keysl.every(key => {
        return isEqualAny(lhs[key], rhs[key]);
    });
}


function isEqualAny(lhs: unknown, rhs: unknown): boolean {
    const isObjL = isObject(lhs);
    const isObjR = isObject(rhs);

    if (isObjL !== isObjR)  return false;
    if (isObjL && isObjR) {
        return isEqualObj(lhs, rhs);
    }

    if (isArray(lhs) && isArray(rhs)) {
        return isEqualArray(lhs, rhs);
    }

    if (isMap(lhs) && isMap(rhs)) {
        return isEqualMap(lhs, rhs);
    }

    return lhs === rhs;  
}

function isEqualArray(lArr: unknown[], rArr: unknown[]): boolean {
    if (lArr.length !== rArr.length) return false;

    return lArr.every((value, key) => {
        return isEqualAny(value, rArr[key]);
    });
}

function isEqualStringArray(array1: string[], array2: string[]): boolean {
    return array1.length === array2.length &&
        isEqualPrimitiveSet(new Set(array1), new Set(array2));
}

function isEqualPrimitiveSet(ls: Set<string>, rs: Set<string>): boolean {
    if (ls.size !== rs.size) return false;

    try {
        ls.forEach(ch => {
            if (!rs.has(ch)) throw new Error("not equal")
        });
    }
    catch(exp) {
        return false;
    }
    return true;
}

function isEqualMap(lhs: Map<unknown, unknown>, rhs: Map<unknown, unknown>): boolean {

    if (lhs.size !== rhs.size) return false;

    try {
        lhs.forEach((value, key) => {
            if (!isEqualAny(value, rhs.get(key))) throw new Error("not equal")
        });
    }
    catch(exp) {
        return false;
    }
    return true;
}


export default isEqual;
