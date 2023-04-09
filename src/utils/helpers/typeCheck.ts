// eslint-disable-next-line @typescript-eslint/ban-types
export function isFunction(value: unknown): value is Function  {
    return (value instanceof Function);
}

export function isEvent(value: unknown): value is Event  {
    return (value instanceof Event);
}

export function isHTMLInputElement(value: unknown): value is HTMLInputElement  {
    return (value instanceof HTMLInputElement);
}

export function isHTMLFormElement(value: unknown): value is HTMLFormElement  {
    return (value instanceof HTMLFormElement);
}

export function isHTMLTextAreaElement(value: unknown): value is HTMLTextAreaElement  {
    return (value instanceof HTMLTextAreaElement);
}

export function isString(value: unknown): value is string {
    return ((typeof value) === "string");
}

export function isNumber(value: unknown): value is number {
    return Number.isFinite(value);
}

export function isArray(value: unknown): value is Array<unknown> {
    return Array.isArray(value);
}

//isPlainObject
export function isObject(value: unknown): value is PlainObject {
    return typeof value === "object"
    && value !== null
    && value.constructor === Object
    && Object.prototype.toString.call(value) === "[object Object]";
}

export function isDate(value: unknown): value is Date {
    return value instanceof Date;
}

export function isSet<T>(value: unknown): value is Set<T> {
    return value instanceof Set;
}

export function isMap<T, T1>(value: unknown): value is Map<T, T1> {
    return value instanceof Map;
}

export function isBlob(value: unknown): value is Blob {
    return value instanceof Blob;
}

export function isSimpleType(value: unknown): boolean {
        // Handle:
        // * null
        // typeof value !== "object" ->
        // * undefined
        // * boolean
        // * number
        // * string
        // * symbol
        // * function

    return (value === null || typeof value !== "object") && !isFunction(value);
}
