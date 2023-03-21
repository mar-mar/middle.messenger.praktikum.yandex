import API, { CreateChatData, ChatsAPI, ChatInfo } from '../api/ChatsAPI';
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
        
        MessagesController.closeById(chatId); 

        this.fetchChats();
    }

    async deleteSelectedChat() {
        const chatId = this.getSelectedChat();
        if (!chatId) return;

        await this.delete(chatId);
    }

    // запрашиваем чаты и коннектимся к ним
    async fetchChats() {
        const chats = await this.api.read();

        chats.forEach(async (chat) => {

            const token = await this.getToken(chat.id);

            await MessagesController.connect(chat.id, token);
        });

        store.set('chats', chats);
    }

    // поиск чатов
    async seachChats(filter: string): Promise<ChatInfo[] | undefined> {
        let chats: ChatInfo[] = [];
        try {
            chats = await this.api.search(filter);
        }
        catch(exp) {
            this.errorHandler(exp, true);
            return;
        }
        return chats;
    }

    // добавление юзера в чат
    async addUserToChat(chatId: number, data: SearchUserData) {
        
        this.withSearchUser(data, (userId: number) => {
            this.api.addUsers({ chatId, users: [userId] });
        })
    }

    async removeUserFromChat(chatId: number, data: SearchUserData) {
        
        this.withSearchUser(data, (userId: number) => {
            this.api.removeUsers({ chatId, users: [userId] });
        })
    }

    async addUserToSelectedChat(data: SearchUserData) {
        const chatId = this.getSelectedChat();
        if (!chatId) return;

        await this.addUserToChat(chatId, data);
    }


    async removeUserFromSelectedChat(data: SearchUserData) {
        const chatId = this.getSelectedChat();
        if (!chatId) return;

        await this.addUserToChat(chatId, data);
    }

    async withSearchUser(data: SearchUserData, func: (userId: number) => void) {
        let user;

        try {
            user = await UsersController.search(data);
        }
        catch(exp) { }
        
        if (!user) throw new Error("Не найден пользователь с таким логином");

        try {

            func(user.id);
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
        store.set('selectedChatId', chatId);
    }


    errorHandler(e: any, withThrow: boolean = false) {
        errorLog(e);
        if (withThrow) throw new Error(e?.reason || "Ошибка");
    }

    getSelectedChat(): number | undefined {
        return store.getState().selectedChatId;
    }

    sendMessage(chatId: number, message: string) {
        return MessagesController.sendMessage(chatId, message, this.getToken.bind(this, chatId));
    }
    //{"reason":"title is empty, but required","error":"Bad format"}
}

export default new ChatsController();
