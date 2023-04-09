
type Handler<A extends any[] = unknown[]> = (...args: A) => void;
type MapInterface<P> = P[keyof P]

export class EventBus<
    E extends Record<string, string> = Record<string, string>,
    Args extends Record<MapInterface<E>, any[]> = Record<string, any[]>
> {

    private listeners: {
        [K in MapInterface<E>]?: Handler<Args[K]>[]
    } = {};

    on<Event extends MapInterface<E>>(event: Event, callback: Handler<Args[Event]>) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }


        this.listeners[event]?.push(callback);
    }

    off<Event extends MapInterface<E>>(event: Event, callback: Handler<Args[Event]>) {
        if (!this.listeners[event]) {
            throw new Error(`Нет события: ${event}`);
        }

        let newEvents = this.listeners?.[event] ?? [];
        
        newEvents = newEvents.filter(
            listener => listener !== callback
        );

        this.listeners[event] = newEvents;
    }

    emit<Event extends MapInterface<E>>(event: Event, ...args: Args[Event]) {
        if (!this.listeners[event]) {
            return;
        }

        this.listeners[event]?.forEach(listener => {
            listener(...args);
        });
    }

    offAll() {
        this.listeners = {};
    }
}
