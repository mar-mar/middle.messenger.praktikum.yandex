import { get } from "../utils/helpers/merge";
import { isArray } from "../utils/helpers/typeCheck";
import store from '../utils/Store';
import WSTransport, { WSTransportEvents } from "../utils/transport/WSTransport";

export interface TransportMessage {
    type: string;
}

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
    async connect(chatId: number, token: string) {
        if (this.sockets.has(chatId)) {
            return;
        }

        const userId = store.getState().user?.id;

        const wsTransport = new WSTransport(`chats/${userId}/${chatId}/${token}`);

        this.sockets.set(chatId, wsTransport);

        await wsTransport.connect();

        this.subscribe(wsTransport, chatId);
        this.fetchOldMessages(chatId);
    }

    // отправка сообщений
    async sendMessage(chatId: number, message: string, getToken: () => Promise<string>) {
        

        if (!this.sockets.has(chatId)) {
            const token = await getToken();
            await this.connect(chatId, token);
        }

        const socket = this.sockets.get(chatId);
        if (!socket) throw new Error(`Chat ${chatId} is not connected`);

        socket.send({
            type: 'message',
            content: message,
        });
    }

    private clearMessage(_chatId: number) {
       // store.set(`messages.${chatId}`, undefined);
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
    private onTransportMessage(chatId: number, message: TransportMessage | TransportMessage[]) {

        const messages = isArray(message) ? message : [message];
        const firstMessage: TransportMessage = messages[0];
        if (!firstMessage) return;
        
        switch (firstMessage.type) {
            case "message": 
                this.onMessage(chatId, messages as Message[]);
                 break;
            case "user connected": 
                break;
        }

    }
    
    
    private onMessage(chatId: number, messages: Message[]) {
        let messagesToAdd: Message[] = messages.reverse();

        const state = store.getState();
        const currentMessages = get(state, `messages.${chatId}.messages`) || [];

        messagesToAdd = [...currentMessages, ...messagesToAdd];
        
        const lastMessage = messagesToAdd[messagesToAdd.length-1];

        store.set(`messages.${chatId}`, {
            messages: messagesToAdd,
            scrollMessage: lastMessage
        });

        store.set(`chats.${chatId}.last_message.time`, lastMessage.time);
    }

    // удалить из мапа при закрытии подключения
    private onClose(id: number) {
        this.sockets.delete(id);
        this.clearMessage(id);
    }

    // подписываемся на события транспорта
    private subscribe(transport: WSTransport, id: number) {
        transport.on(WSTransportEvents.MESSAGE, (message) => this.onTransportMessage(id, message));
        transport.on(WSTransportEvents.CLOSE, () => this.onClose(id));
    }
}

export default new MessagesController();
