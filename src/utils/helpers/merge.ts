import { isObject } from "./typeCheck";

export type Indexed<T = any> = {
    [key in string]: T;
};

export function merge(lhs: Indexed, rhs: Indexed): Indexed {

    if (isObject(lhs) && isObject(rhs)) {

        for (let p in rhs) {
            if (!rhs.hasOwnProperty(p)) {
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

export function mergeObj(lhs: Indexed, rhs: Indexed): Indexed {
    if (isObject(rhs) && isObject(rhs)) {

    }

    for (let p in rhs) {
        if (!rhs.hasOwnProperty(p)) {
            continue;
        }

        if (isObject(rhs[p]) && isObject(lhs[p])) {

            merge(lhs[p] as Indexed, rhs[p] as Indexed);
            continue;
        }

        lhs[p] = rhs[p];
    }

    return lhs;
}


export function set(object: Indexed | unknown, path: string, value: unknown): Indexed | unknown {

    if (!isObject(object)) {
        return object;
    }

    if (typeof path !== 'string') {
        throw new Error('path must be string');
    }

    const result = path.split('.').reduceRight<Indexed>((acc, key) => ({
       
        [key]: acc,
    }), value as any);

    return merge(object as Indexed, result);
}


export function get(object: Indexed | unknown, path: string): any {
    if (typeof path !== 'string') {
        throw new Error('path must be string');
    }

    if (!isObject(object)) return undefined;

    const isOk = path.split('.').every(key => {

        if (!isObject(object)) return false;
        object = object[key];

        return true;
    });

    return isOk ? object : undefined;
}
