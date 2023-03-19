export function dateToStr(date: Date): string {
    const today = new Date();

    if(today.toDateString() === date.toDateString()) {
        return date.toLocaleTimeString();
    }

    return date.toLocaleString();
}
