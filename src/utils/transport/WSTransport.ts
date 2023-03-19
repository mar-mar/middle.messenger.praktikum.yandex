import { eventBusWithStore } from "../Store";

export enum WSTransportEvents {
    CONNECTED = 'connected',
    ERROR = 'error',
    MESSAGE = 'message',
    CLOSE = 'close',
}

type TransportStore = { sleep?: boolean };

const WSTransportBase = eventBusWithStore<TransportStore>(state => {
    return { sleep: state.sleep }
});

export default class WSTransport extends WSTransportBase {
    static BASE_URL = 'wss://ya-praktikum.tech/ws';
    static PING_INTERVAL: 5000;
    //`wss://ya-praktikum.tech/ws/chats/${userId}/${id}/${token}`

    private socket: WebSocket | null = null;
    private url: string;
    private pingInterval: number = 0;

    constructor(path: string) {

        super();

        this.url = `${WSTransport.BASE_URL}/${path}/`;
       // this.on(eventBusWithStoreEventName, this.onChangeTransportStore.bind(this))
    }

    public send(data: unknown) {
        if (!this.socket) {
            throw new Error('Socket is not connected');
        }

        this.socket.send(JSON.stringify(data))
    }

    public connect(): Promise<void> {
        this.socket = new WebSocket(this.url);

        this.subscribe(this.socket);

        return new Promise((resolve) => {

            this.on(WSTransportEvents.CONNECTED, () => {
                this.setupPing();

                resolve();
            });
        });
    }

    public close() {
        this.socket?.close();
    }

    private setupPing() {

        this.pingInterval = setInterval(() => {
            this.send({ type: 'ping' });
        }, WSTransport.PING_INTERVAL)

        this.on(WSTransportEvents.CLOSE, () => {
            if (this.pingInterval) clearInterval(this.pingInterval);

            this.pingInterval = 0;
        })
    }

    private subscribe(socket: WebSocket) {
        // ??? removeEventListener

        socket.addEventListener('open', () => {
            this.emit(WSTransportEvents.CONNECTED)
        });
        socket.addEventListener('close', () => {
            this.emit(WSTransportEvents.CLOSE)
        });

        socket.addEventListener('error', (e) => {
            this.emit(WSTransportEvents.ERROR, e)
        });

        socket.addEventListener('message', (message) => {
            const data = JSON.parse(message.data);

            if (data.type && data.type === 'pong') {
                return;
            }

            this.emit(WSTransportEvents.MESSAGE, data)
        });
    }

    /*onChangeTransportStore(data: TransportStore) {
        if (data.sleep) {

        }
    }*/
}

