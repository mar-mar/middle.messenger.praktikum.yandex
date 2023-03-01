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

export function isString(value: unknown): value is string {
    return ((typeof value) === 'string');
}
