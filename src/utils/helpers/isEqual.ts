import { isArray, isMap, isObject } from "./typeCheck";

type Indexed<T = unknown> = {
    [key in string]: T;
};


function isEqual(a: Indexed, b: Indexed): boolean {
    return isEqualAny(a, b);
}

function isEqualObj(lhs: Indexed, rhs: Indexed): boolean {
    const keysl = Object.keys(rhs);
    const keys2 = Object.keys(rhs);
    if (!isEqualStringArray(keysl, keys2)) return false;

    return keysl.every(key => {
        return isEqualAny(lhs[key], rhs[key]);
    });
}


function isEqualAny(lhs: any, rhs: any): any {
    const isObjL = isObject(lhs);
    const isObjR = isObject(rhs);

    if (isObjL !== isObjR)  return false;
    if (isObjL) {
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

function isEqualArray(lArr: any[], rArr: any[]): boolean {
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

function isEqualMap(lhs: Map<any, any>, rhs: Map<any, any>): boolean {

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
