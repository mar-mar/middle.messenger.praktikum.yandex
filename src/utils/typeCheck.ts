
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

export function isHTMLTextAreaElement(value: unknown): value is HTMLTextAreaElement  {
    return (value instanceof HTMLTextAreaElement);
};

export function isString(value: unknown): value is string {
    return ((typeof value) === 'string');
}

export function isArray(value: unknown): value is Array<any> {
    return Array.isArray(value);
}

export function isObject(value: unknown): value is object {
    return  (
        typeof value === 'object' &&
        !Array.isArray(value) &&
        value !== null
    ) ;
}

