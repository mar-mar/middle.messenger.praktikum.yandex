export default function trim(str: string, sub: string = "\x20\xa0"): string {

    const hi = str.length - 1;
    const start = getIndex(str, sub, 0, hi, +1);
    if (start >= hi) { return ""; }

    const end = getIndex(str, sub, hi, start, -1);
    const result = str.substring(start, end + 1);
    return result;
}

function getIndex(str: string, sub: string,
    start: number, end: number, vector: number): number {
    let result = start;
    let i = start;
    let next = true;

    while (next) {
        next = false;

        if ((start !== end) && (sub.indexOf(str[i]) >= 0)) {
            i = i + vector;
            result = i;
            next = true;
        }
    }

    return result;
}

