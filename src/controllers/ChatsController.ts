import AvatarAPI, { AvatarData, AvatarUsersAPI } from "../api/AvatarAPI";
import API, { CreateChatData, ChatsAPI, ChatInfo } from '../api/ChatsAPI';
import { SearchUserData } from "../api/UsersAPI";
import { errorLog } from "../utils/logger";
import store from '../utils/Store';
import MessagesController from './MessagesController';
import UsersController from "./UsersController";

class ChatsController {

    private readonly api: ChatsAPI;
    private readonly avatarApi: AvatarUsersAPI;
    
    constructor() {
        this.api = API;
        this.avatarApi = AvatarAPI;
    }

    closeAll() {
        MessagesController.closeAll();
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

    // изменить аватар
    async avatar(data: AvatarData) {
        const chatId = this.getSelectedChat();
        if (!chatId) return;

        try {
            
            const chat = await this.avatarApi.chatAvatar({ ...data, chatId });
            store.set(`chats.${chatId}`, chat);

        } catch (exp: any) {

            this.errorHandler(exp, true);
        }
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

        this.selectChat();
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
        
        await this.withSearchUser(data, (userId: number) => {
            return this.api.addUsers({ chatId, users: [userId] });
        })
    }

    async removeUserFromChat(chatId: number, data: SearchUserData) {
        
        await this.withSearchUser(data, (userId: number) => {
            return this.api.removeUsers({ chatId, users: [userId] });
        })
    }

    async addUserToSelectedChat(data: SearchUserData) {
        const chatId = this.getSelectedChat();
        if (!chatId) return;

        await this.addUserToChat(chatId, data);
        this.fetchChatUsers();
    }


    async removeUserFromSelectedChat(data: SearchUserData) {
        const chatId = this.getSelectedChat();
        if (!chatId) return;

        await this.removeUserFromChat(chatId, data);
        this.fetchChatUsers();
    }

    async withSearchUser(data: SearchUserData, func: (userId: number) => Promise<any>) {
        let users;

        try {
            users = await UsersController.search({ ...data, limit: 1 });
        }
        catch(exp) { }
        
        const userId = users?.[0]?.id;
        if (!userId) throw new Error("Не найден пользователь с таким логином");

        try {
            await func(userId);
        }
        catch (exp) {

            this.errorHandler(exp, true);
            return;
        }
    }

    private async getToken(chatId: number): Promise<string> {
        return this.api.getToken(chatId);
    }

    // выделить chat
    async selectChat(chatId?: number) {

        store.set("selectedChatId", chatId);
        await this.fetchChatUsers();
    }

    async fetchChatUsers() {
        let users;
        const chatId = this.getSelectedChat();

        if (undefined !== chatId) {
            try {
                users = await this.api.fetchChatUsers(chatId);
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
