import { isObject } from "./typeCheck";

type Indexed<T = unknown> = {
    [key in string]: T;
};


function merge(lhs: Indexed, rhs: Indexed): Indexed {
    mergeObj(lhs, rhs);
    //console.info(lhs, rhs, result);
    return lhs;
}

function mergeObj(lhs: Indexed, rhs: Indexed): Indexed {

    Object.keys(rhs).forEach(key => {
        lhs[key] = mergeAny(lhs[key], rhs[key], lhs.hasOwnProperty(key));
    });
    return lhs;
}

function mergeAny(lhs: any, rhs: any, hasPropL: boolean): any {

    if (!hasPropL) {
        return rhs;
    }

    const isObjL = isObject(lhs);
    const isObjR = isObject(rhs);

    if (isObjR && isObjL) {
        return mergeObj(lhs, rhs);
    }
    else {
        return rhs;
    }
}

export default merge;
