import {AnyFunction} from "./types";

export function isFunction(value: unknown): value is AnyFunction  {
    return (value instanceof Function);
};

export function isEvent(value: unknown): value is Event  {
    return (value instanceof Event);
};
