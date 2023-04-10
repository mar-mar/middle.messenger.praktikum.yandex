import { StoreItem, eventBusWithStore } from "../Store";


export enum WSTransportEvents {
    CONNECTED = "connected",
    ERROR = "error",
    MESSAGE = "message",
    CLOSE = "close"
}

interface TransportStore extends StoreItem { sleep?: boolean }


const WSTransportBase = eventBusWithStore<TransportStore>(state => {
    return { sleep: state.sleep }
});

export default class WSTransport extends WSTransportBase {
    static BASE_URL = "wss://ya-praktikum.tech/ws";
    static PING_INTERVAL: number = 5000;
    //`wss://ya-praktikum.tech/ws/chats/${userId}/${id}/${token}`

    private socket: WebSocket | null = null;
    private url: string;
    private pingTimeout: number = 0;

    constructor(path: string) {

        super();

        this.url = `${WSTransport.BASE_URL}/${path}/`;
        // this.on(eventBusWithStoreEventName, this.onChangeTransportStore.bind(this))
    }

    public send(data: unknown) {
        if (!this.socket) {
            throw new Error("Socket is not connected");
        }

        this.socket.send(JSON.stringify(data))
    }

    public connect(): Promise<void> {
        this.socket = new WebSocket(this.url);

        this.subscribe(this.socket);

        return new Promise((resolve) => {

            this.on(WSTransportEvents.CONNECTED, () => {
                this.initPing();

                resolve();
            });
        });
    }

    public close() {
        this.socket?.close();
    }

    private initPing() {

        this.togglePing(true);

        this.on(WSTransportEvents.CLOSE, () => {
            this.togglePing(false);
        })
    }

    private togglePing(value: boolean) {
        if (this.pingTimeout) clearInterval(this.pingTimeout);
        this.pingTimeout = 0;

        if (!value) return;

        this.pingTimeout = window.setTimeout(() => {

            if (this.socket?.readyState === 1) { // закрывается не сразу можем поймать ошибки

                this.send({ type: "ping" });
            } 

            this.togglePing(true);
        }, WSTransport.PING_INTERVAL)
    }


    private subscribe(socket: WebSocket) {
        // ??? removeEventListener

        socket.addEventListener("open", () => {
            this.emit(WSTransportEvents.CONNECTED)
        });
        socket.addEventListener("close", () => {
            this.emit(WSTransportEvents.CLOSE)
        });

        socket.addEventListener("error", (e) => {
            this.emit(WSTransportEvents.ERROR, e)
        });

        socket.addEventListener("message", (message) => {
            const data = JSON.parse(message.data);

            if (data.type && data.type === "pong") {
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

