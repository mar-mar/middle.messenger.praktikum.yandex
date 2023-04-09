import { isObject } from "./typeCheck";



function merge(lhs: PlainObject, rhs: PlainObject): PlainObject {

    if (!isObject(lhs) || !isObject(rhs)) throw new Error("merge. no object")

    return mergeUnknown(lhs, rhs);
}

function mergeUnknown(lhs: PlainObject, rhs: PlainObject): PlainObject {
    
    for (const p in rhs) {

        let lhsSub = lhs[p];
        const rhsSub = rhs[p];

        if (isObject(lhsSub) && isObject(rhsSub)) {
            lhsSub = mergeUnknown(lhsSub, rhsSub);
        }
        else {
            lhsSub = rhsSub
        }
        lhs[p] = lhsSub;
    }

    return lhs;
}


export function set(object: PlainObject | unknown, path: string, value: unknown): PlainObject | unknown {

    if (!isObject(object)) {
        return object;
    }

    if (typeof path !== "string") {
        throw new Error("path must be string");
    }

    const result = path.split(".").reduceRight<PlainObject>((acc, key) => ({
        [key]: acc
    }), value as PlainObject);

    return merge(object as PlainObject, result);
}


export function get(object: PlainObject | unknown, path: string): unknown {
    
    if (typeof path !== "string") {
        throw new Error("path must be string");
    }

    if (!isObject(object)) return undefined;

    const isOk = path.split(".").every(key => {

        if (!isObject(object)) return false;
        object = object[key];

        return true;
    });

    return isOk ? object : undefined;
}
