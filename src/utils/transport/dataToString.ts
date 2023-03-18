import { isArray, isDate, isFunction, isObject, isSimpleType } from "../typeCheck";

type StringIndexed = Record<string, any>;
type GetKeyFunc = (key: string) => string;

//todo декодировать параметры!!!
export default function queryStringify(data: StringIndexed): string | never {
    
    if (!isObject(data)) throw "input must be an object";

    const qStr = queryStringifyAny(data, getKeyFunc(""));
    return qStr ? qStr.slice(0, -1) : "";
}

function getKeyFunc(parentKey: string): GetKeyFunc {

    return function(key: string):string {
        if (!parentKey) return key;
        if (!key) return parentKey;

        return `${parentKey}[${key}]`;
    }
}

function queryStringifyAny(obj: any, getKey: GetKeyFunc): any {

    if (isSimpleType(obj) || isFunction(obj) || isDate(obj)) {
        return getKey("") + "=" + encodeURIComponent(String(obj)) + "&";
    }

 
    if (isArray(obj)) {
        
        let srt = "";
        obj.forEach((value, i) => srt += getChildQStr(value, i, getKey));

        return srt;
    }

   /* if (isSet(obj)) {
        const clone = new Set();

        obj.forEach(value => clone.add(cloneDeepAny(value)));
        return clone;
    }

    if (isMap(obj)) {
        const clone = new Map();

        obj.forEach((value, key) => clone.set(key, cloneDeepAny(value)));
        return clone;
    }*/

    if (isObject(obj)) {
        let srt = "";
        //Reflect.ownKeys(obj).forEach(key => (clone[key] = cloneDeepAny(obj[key])));
        Object.entries(obj).forEach(([key, value]) => srt += getChildQStr(value, key, getKey));

        return srt;
    }
    
    return "";
    //throw new Error(`Unable to copy object: ${obj}`);
}


function getChildQStr(value: any, key: string | number, getKey: GetKeyFunc) {
    const fullKey = getKey(String(key));
    return queryStringifyAny(value, getKeyFunc(fullKey));
}
