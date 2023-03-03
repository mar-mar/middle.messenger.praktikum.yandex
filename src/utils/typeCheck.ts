import {AnyFunction} from "./types";

export function isFunction(value: unknown): value is AnyFunction  {
    return (value instanceof Function);
};

export function isEvent(value: unknown): value is Event  {
    return (value instanceof Event);
};

export function isHTMLInputElement(value: unknown): value is HTMLInputElement  {
    return (value instanceof HTMLInputElement);
};

export function isHTMLFormElement(value: unknown): value is HTMLFormElement  {
    return (value instanceof HTMLFormElement);
};

export function isString(value: unknown): value is string {
    return ((typeof value) === 'string');
}

export function isArray(value: unknown): value is Array<any> {
    return Array.isArray(value);
}
