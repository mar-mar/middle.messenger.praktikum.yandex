import merge from "./mergeMy";
import { isObject, isString } from "./typeCheck";

type Indexed<T = unknown> = {
    [key in string]: T;
};


function set(object: Indexed | unknown, path: string|any, value: unknown): Indexed | unknown {
  
	if (!isString(path) || !path) throw "path must be string";
    if (!isObject(object)) return object;

  
    const valueObj = path.split('.').reduceRight<Indexed>((acc, key) => ({
        [key]: acc,
    }), value as any);

    return merge(object, valueObj);
}

export default set;
