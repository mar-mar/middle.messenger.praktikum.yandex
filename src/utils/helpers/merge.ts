import { isObject } from "./typeCheck";

export type Indexed<T = any> = {
    [key in string]: T;
};

export function merge(lhs: Indexed, rhs: Indexed): Indexed {

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

export function set(object: Indexed | unknown, path: string, value: unknown): Indexed | unknown {

    if (!isObject(object)) {
        return object;
    }

    if (typeof path !== "string") {
        throw new Error("path must be string");
    }

    const result = path.split(".").reduceRight<Indexed>((acc, key) => ({
        [key]: acc
    }), value as any);

    return merge(object as Indexed, result);
}


export function get(object: Indexed | unknown, path: string): any {
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
