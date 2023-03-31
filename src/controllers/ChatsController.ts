import { User } from "../api/AuthAPI";
import AvatarAPI, { AvatarData, AvatarUsersAPI } from "../api/AvatarAPI";
import API, { CreateChatData, ChatsAPI, ChatInfo, SearchChatUsersData } from '../api/ChatsAPI';
import { errorLog } from "../utils/logger";
import store from '../utils/Store';
import MessagesController from './MessagesController';


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
    async addUserToChat(chatId: number, userIds: number[]) {
        
        try {
            await this.api.addUsers({ chatId, users: userIds });
        }
        catch (exp) {

            this.errorHandler(exp, true);
            return;
        }
    }

    async removeUserFromChat(chatId: number, userIds: number[]) {

        try {
            await this.api.removeUsers({ chatId, users: userIds });
        }
        catch (exp) {

            this.errorHandler(exp, true);
            return;
        }
    }

    async addUserToSelectedChat(userIds: number[]) {
        const chatId = this.getSelectedChat();
        if (!chatId) return;

        await this.addUserToChat(chatId, userIds);
        this.fetchChatUsers();
    }


    async removeUserFromSelectedChat(userIds: number[]) {
        const chatId = this.getSelectedChat();
        if (!chatId) return;

        await this.removeUserFromChat(chatId, userIds);
        this.fetchChats(); // обновим список чатов, так как если удалим себя - чат удалится
        this.fetchChatUsers();
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
        const chatId = this.getSelectedChat();
        let users;

        try {
            users = await this.searchChatUsers();
        }
        catch(exp) {}

        if (chatId === store.getState().selectedChatId) {
            store.set("selectedChatUsers", users ? new Map(users.map(u => [u.id, u] )) : undefined);
        }
    }

    async searchChatUsers(filter?: SearchChatUsersData) : Promise<User[] | undefined>{
        let users;
        const chatId = this.getSelectedChat();

        if (undefined !== chatId) {

            try {
                users = await this.api.fetchChatUsers(chatId, filter);
            }
            catch(exp) { 
                this.errorHandler(exp, true);
            }
        }

        return users;
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
