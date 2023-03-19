import API, { CreateChatData, ChatsAPI } from '../api/ChatsAPI';
import { SearchUserData } from "../api/UsersAPI";
import { errorLog } from "../utils/logger";
import store from '../utils/Store';
import MessagesController from './MessagesController';
import UsersController from "./UsersController";

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

    // удаление чата
    async delete(chatId: number) {
        try {            
            await this.api.delete(chatId);
        }
        catch(exp) {
            
            this.errorHandler(exp, true);
            return;
        }

        debugger
        MessagesController.closeById(chatId); //закрывает бэк???
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

        store.set('chats', mapChats);
    }

    // добавление юзера в чат
    async addUserToChat(chatId: number, data: SearchUserData) {
        let user;

        try {
            user = await UsersController.search(data);
        }
        catch(exp) { }
        
        if (!user) throw new Error("Не найден пользователь с таким логином");

        try {

            this.api.addUsers({ chatId, users: [user.id] });
        }
        catch (exp) {

            this.errorHandler(exp, true);
            return;
        }

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
