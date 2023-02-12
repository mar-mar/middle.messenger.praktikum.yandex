
function identity(value) {
    return value;
} 

function last(list) {
	if (!Array.isArray(list)) return;
  
    const lastIndex = list.length - 1;
    if (lastIndex < 0) return;
    return list[lastIndex];
}

function first(list) {
	if (!Array.isArray(list) || 0 === list.length) return;
    return list[0];
}

function rangeRight(start, end, step) {
    return range(start, end, step, true);
}

function range(start, end, step, isRight) {
if (!Number.isFinite(start)) {
  return [];
}
const minus = start < 0;


if (!Number.isFinite(end)) {
  end = start;
  start = 0;
  if (minus) { step = null; } //отрицательное начало без конца или шага.
}

if (!Number.isFinite(step)) {
  step = minus ? -1 : 1;
}

const count = Math.trunc(Math.abs((end - start) / (step || 1)));
const result = [];
for (let irange=0; irange < count; irange++) {
  const stepValue = start + step * irange;
  result[isRight ? (count - irange - 1) : irange] = stepValue;
}

return result;
};

function isLength(value) {
    return (
      typeof value === "number" &&
      value > -1 &&
      value % 1 === 0 &&
      value <= Number.MAX_SAFE_INTEGER
    );
  }
  
  function isNil(value) {
    return value === null || value === undefined;
  }
  
  function isArrayLike(value) {
    return !isNil(value) && typeof value !== "function" && isLength(value.length);
  }
  
  function isObjectLike(value) {
    return typeof value === "object" && value !== null;
  }
  
  function getTag(value) {
    if (value === null) {
      return value === undefined ? "[object Undefined]" : "[object Null]";
    }
    return toString.call(value);
  }
  
  const objectProto = Object.prototype;
  function isPrototype(value) {
    const ctor = value && value.constructor;
    const proto = (typeof ctor === "function" && ctor.prototype) || objectProto;
  
    return value === proto;
  }
  
  function isArguments(value) {
    return isObjectLike(value) && getTag(value) === "[object Arguments]";
  }
  
  // Реализация лодаша
  function isEmpty(value) {
    if (value === null) {
      return true;
    }
  
    if (
      isArrayLike(value) &&
      (Array.isArray(value) ||
        typeof value === "string" ||
        typeof value.splice === "function" ||
        isBuffer(value) ||
        isTypedArray(value) ||
        isArguments(value))
    ) {
      return !value.length;
    }
  
    const tag = getTag(value);
    if (tag === "[object Map]" || tag === "[object Set]") {
      return !value.size;
    }
  
    if (isPrototype(value)) {
      return !Object.keys(value).length;
    }
  
    for (const key in value) {
      if (hasOwnProperty.call(value, key)) {
        return false;
      }
    }
  
    return true;
  }


  function isIterable1(obj) {
    return obj && ((typeof obj[Symbol.iterator]) === 'function');
  }
  
  function isEmpty1(value) {
      if (!value) return true;
      
      const typeofStr = typeof value;
      switch (typeofStr) {
        // undefined
        case "boolean": 
        case "number":  
        case "bigint": 
          return true; 
          
        case "string": 
        case "function": 
          return false; 
        
        default:
          if (isIterable1(value)) {
            const iterator = value[Symbol.iterator]();
            return iterator.next().done;
          }
          //if (Array.isArray(value)) return value.length === 0;
          //if (value instanceof Set || value instanceof Map) return value.size === 0;
          return Object.keys(value).length === 0;
      }
  }
