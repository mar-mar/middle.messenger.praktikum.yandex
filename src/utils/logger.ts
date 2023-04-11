
export class Logger {

    log(value: unknown): void {
        console.log(value);
    }
    
    
    errorLog(value: unknown): void {
        console.warn(value);
    }

}

export default new Logger();
