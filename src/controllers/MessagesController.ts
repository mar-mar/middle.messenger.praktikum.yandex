//import WSTransport, { WSTransportEvents } from '../utils/WSTransport';
import store from '../utils/Store';
import WSTransport, { WSTransportEvents } from "../utils/transport/WSTransport";

export interface Message {
    chat_id: number;
    time: string;
    type: string;
    user_id: number;
    content: string;
    /*file?: {
        id: number;
        user_id: number;
        path: string;
        filename: string;
        content_type: string;
        content_size: number;
        upload_date: string;
    }*/
}

export interface SendMessageData {
    message: string;
}

class MessagesController {
    // по активным чатам
    private sockets: Map<number, WSTransport> = new Map();

    // создать коннект и получить сообщения
    async connect(id: number, token: string) {
        if (this.sockets.has(id)) {
            return;
        }

        const userId = store.getState().user?.id;

        const wsTransport = new WSTransport(`chats/${userId}/${id}/${token}`);

        this.sockets.set(id, wsTransport);

        await wsTransport.connect();

        this.subscribe(wsTransport, id);
        this.fetchOldMessages(id);
    }

    // отправка сообщений
    sendMessage(chatId: number, message: string) {
        const socket = this.sockets.get(chatId);

        if (!socket) {
            throw new Error(`Chat ${chatId} is not connected`);
        }

        socket.send({
            type: 'message',
            content: message,
        });
    }

    // страница pageNumber с сообщениями, 20 сообщений на странице
    private fetchOldMessages(id: number, pageNumber: number = 0) {
        const socket = this.sockets.get(id);

        if (!socket) {
            throw new Error(`Chat ${id} is not connected`);
        }

        socket.send({ type: 'get old', content: `${pageNumber}` });
    }

    // при logoff
    closeAll() {
        Array.from(this.sockets.values()).forEach(socket => socket.close());
    }

    // при удалении чата
    closeById(chatId: number) {
        const socket = this.sockets.get(chatId);
        if (socket) socket.close();
    }

    // получили какие-то осообщения
    private onTransportMessage(chatId: number, messages: Message | Message[]) {
        let messagesToAdd: Message[] = [];

        if (Array.isArray(messages)) {
            messagesToAdd = messages.reverse();
        } else {
            messagesToAdd.push(messages);
        }

        const currentMessages = (store.getState().messages || {})[chatId] || [];

        messagesToAdd = [...currentMessages, ...messagesToAdd];

        store.set(`messages.${chatId}`, messagesToAdd);
    }

    // удалить из мапа при закрытии подключения
    private onClose(id: number) {
        this.sockets.delete(id);
    }

    // подписываемся на события транспорта
    private subscribe(transport: WSTransport, id: number) {
        transport.on(WSTransportEvents.MESSAGE, (message) => this.onTransportMessage(id, message));
        transport.on(WSTransportEvents.CLOSE, () => this.onClose(id));
    }
}

export default new MessagesController();
