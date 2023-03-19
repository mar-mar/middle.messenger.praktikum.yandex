import API, { CreateChatData, ChatsAPI } from '../api/ChatsAPI';
import { errorLog } from "../utils/logger";
import store from '../utils/Store';
import MessagesController from './MessagesController';

class ChatsController {

    private readonly api: ChatsAPI;

    constructor() {
        this.api = API;
    }

    // создание чата
    async create(data: CreateChatData) {
        try {
            await this.api.create(data);

        }
        catch(exp) {
            this.errorHandler(exp, true);
            return;
        }

        this.fetchChats();
    }

    // запрашиваем чаты и коннектимся к ним
    async fetchChats() {
        const chats = await this.api.read();
        const mapChats = new Map();

        chats.forEach(async (chat) => {
            
            mapChats.set(chat.id, chat);

            const token = await this.getToken(chat.id);

            await MessagesController.connect(chat.id, token);
        });

        store.set('chats', chats);
    }

    // добавление юзера в чат
    addUserToChat(chatId: number, userId: number) {
        this.api.addUsers(chatId, [userId]);
    }

    // удаление чата
    async delete(chatId: number) {
        await this.api.delete(chatId);

        this.fetchChats();
    }


    private async getToken(chatId: number): Promise<string> {
        return this.api.getToken(chatId);
    }

    selectChat(chatId: number) {
        store.set('selectedChat', chatId);
    }


    errorHandler(e: any, withThrow: boolean = false) {
        errorLog(e);
        if (withThrow) throw new Error(e?.reason || "Ошибка");
    }

    //{"reason":"title is empty, but required","error":"Bad format"}
}

export default new ChatsController();
