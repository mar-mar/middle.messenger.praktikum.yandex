import { isObject, PlainObject } from "./typeCheck";



export function merge(lhs: PlainObject, rhs: any): PlainObject {

    if (isObject(lhs) && isObject(rhs)) {

        for (const p in rhs) {
            if (!Object.prototype.hasOwnProperty.call(rhs, p)) {
                continue;
            }

            lhs[p] = merge(lhs[p], rhs[p]);
        }
    }
    else {
        lhs = rhs;
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
    }), value as any);

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
