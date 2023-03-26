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

        this.selectChat();

        await this.delete(chatId);
    }

    // запрашиваем чаты и коннектимся к ним
    async fetchChats() {
        const chats = await this.api.read();
        const mapChats: Record<number, any> = {};

        const oldKeys = new Set(Object.keys(store.getState().chats || {}));
 
        chats.forEach(async (chat) => {

            mapChats[chat.id] = chat;
            oldKeys.delete(String(chat.id));

            const token = await this.getToken(chat.id);

            await MessagesController.connect(chat.id, token);
        });

        oldKeys.forEach(key => {
            mapChats[parseInt(key)] = undefined;
        });

        store.set('chats', mapChats);
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
        let users;

        try {
            users = await UsersController.search(data);
        }
        catch(exp) { }
        
        const userId = users?.[0]?.id;
        if (!userId) throw new Error("Не найден пользователь с таким логином");

        try {

            func(userId);
        }
        catch (exp) {

            this.errorHandler(exp, true);
            return;
        }
    }

    private async getToken(chatId: number): Promise<string> {
        return this.api.getToken(chatId);
    }


    async selectChat(chatId?: number) {

        store.set("selectedChatId", chatId);
        let users;

        if (undefined !== chatId) {
            try {
                users = await this.api.getChatUsers(chatId);
            }
            catch(exp) { 
                this.errorHandler(exp, false);
            }
        }

        if (chatId === store.getState().selectedChatId) {
            store.set("selectedChatUsers", users ? new Map(users.map(u => [u.id, u] )) : undefined);
        }
        
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
