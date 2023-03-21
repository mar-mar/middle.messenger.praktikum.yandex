import _BaseAPI from './_BaseAPI';
import { User } from './AuthAPI';

export interface ChatInfo {
    id: number;
    title: string;
    avatar: string;
    unread_count: number;
    time: string;
    
    last_message: {
        user: User,
        time: string;
        content: string;
    }
};

export interface CreateChatData {
    title: string;
}

export interface AddUserToChatData {
    chatId: number;
    users: number[];
}


export interface RemoveUserFromChatData {
    chatId: number;
    users: number[];
}


export class ChatsAPI extends _BaseAPI {
    constructor() {
        super('chats');
    }

    create(data: CreateChatData) {
        return this.http.post('', { data });
    }

    delete(id: number) {
        return this.http.delete('', { data: { chatId: id }});
    }

    search(filter: string): Promise<ChatInfo[]> {
        return this.http.get('', { data: { title: filter }} );
    }

    read(): Promise<ChatInfo[]> {
        return this.http.get('');
    }

    getUsers(id: number): Promise<Array<User & { role: string }>> {
        return this.http.get(`${id}/users`)
    }

    addUsers(data: AddUserToChatData): Promise<unknown> {
        return this.http.put('users', { data });
    }

    removeUsers(data: RemoveUserFromChatData): Promise<unknown> {
        return this.http.put('users', { data });
    }

    async getToken(chatId: number): Promise<string> {
        const response = await this.http.post<{ token: string }>(`token/${chatId}`);

        return response.token;
    }

    getChatUsers(chatId: number): Promise<User[]> {
        return this.http.get(`chats/${chatId}/users`, { data: { limit: 100 }} );
    }

    

}

export default new ChatsAPI();
