import { isObject } from "./typeCheck";

export type Indexed<T = any> = {
    [key in string]: T;
};

export function merge(lhs: Indexed, rhs: Indexed): Indexed {
    for (let p in rhs) {
        if (!rhs.hasOwnProperty(p)) {
            continue;
        }

        try {
            if (rhs[p].constructor === Object) {
                lhs[p] = merge(lhs[p] as Indexed, rhs[p] as Indexed);
            } else {
                lhs[p] = rhs[p];
            }
        } catch (e) {
            lhs[p] = rhs[p];
        }
    }

    return lhs;
}

export function set(object: Indexed | any, path: string, value: unknown): Indexed | unknown {
    if (!isObject(object)) {
        return object;
    }

    if (typeof path !== 'string') {
        throw new Error('path must be string');
    }

    const paths = path.split('.');
    const hi = paths.length - 1;
    
    path.split('.').forEach((key, ikey) => {

        if (hi === ikey) {
            object[key] = value;
            return;
        }

        if (!isObject(object[key])) object[key] = {};
        object = object[key];
    });

    return object;
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
