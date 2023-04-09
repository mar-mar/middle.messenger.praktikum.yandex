import { isArray, isDate, isFunction, isMap, isObject, isSet, isSimpleType } from "./typeCheck";


export default function cloneDeep<T extends PlainObject = PlainObject>(obj: T): T {
    return cloneDeepAny(obj) as T;
}


function cloneDeepAny(obj: unknown): unknown {

    if (isSimpleType(obj) || isFunction(obj)) {
        return obj;
    }

    if (isDate(obj)) {
        return new Date(obj.valueOf());
    }

    if (isArray(obj)) {
        
        const clone: unknown[] = [];
        obj.forEach((value, i) => (clone[i] = cloneDeepAny(value)));

        return clone;
    }

    if (isSet(obj)) {
        const clone = new Set();

        obj.forEach(value => clone.add(cloneDeepAny(value)));
        return clone;
    }

    if (isMap(obj)) {
        const clone = new Map();

        obj.forEach((value, key) => clone.set(key, cloneDeepAny(value)));
        return clone;
    }

    if (isObject(obj)) {
        const clone: Record<string | symbol, unknown> = {};
        //Reflect.ownKeys(obj).forEach(key => (clone[key] = cloneDeepAny(obj[key])));
        Object.entries(obj).forEach(([key, value]) => (clone[key] = cloneDeepAny(value)));

        return clone;
    }

    throw new Error(`Unable to copy object: ${obj}`);
}
