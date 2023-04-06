
export class EventBus {
    private listeners: Record<string, AnyFunctionNoReturn[]> = {};

    on(event: string, callback: AnyFunctionNoReturn) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }


        this.listeners[event]?.push(callback);
    }

    off(event: string, callback: AnyFunctionNoReturn) {
        if (!this.listeners[event]) {
            throw new Error(`Нет события: ${event}`);
        }
         
        this.listeners[event] = this.listeners[event]?.filter(
            listener => listener !== callback
        );
    }
    
    offAll() {
        this.listeners = {};
    }

    emit(event: string, ...args: any) {
        if (!this.listeners[event]) {
            return;
        }

        this.listeners[event]?.forEach(listener => {
            listener(...args);
        });
    }
}
