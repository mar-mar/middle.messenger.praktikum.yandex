type Indexed<T = unknown> = {
    [key in string]: T;
};

function isObject(value: unknown): value is Record<string, any> {
    return (
        typeof value === 'object' &&
        !Array.isArray(value) &&
        value !== null
    );
}

function isString(value: unknown): value is string {
    return ((typeof value) === 'string');
}


function set(object: Indexed | unknown, path: string|any, value: unknown): Indexed | unknown {
  
	if (!isString(path) || !path) throw "path must be string";
    if (!isObject(object)) return object;

  
    const valueObj = path.split('.').reduceRight<Indexed>((acc, key) => ({
        [key]: acc,
    }), value as any);

    return merge(object, valueObj);
}


function merge(lhs: Indexed|unknown, rhs: Indexed|unknown): Indexed|unknown {
    //console.info(lhs, rhs, result);
    return mergeAny(lhs, rhs, true);
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

export default set
