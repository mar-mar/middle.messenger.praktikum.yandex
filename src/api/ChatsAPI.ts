import _BaseAPI from './_BaseAPI';
import { User } from './AuthAPI';

export interface ChatInfo {
    id: number;
    title: string;
    avatar: string;
    unread_count: number;
    last_message: {
        user: User,
        time: string;
        content: string;
    }
}

export interface CreateChatData {
    title: string;
}

export class ChatsAPI extends _BaseAPI {
    constructor() {
        super('/chats');
    }

    create(data: CreateChatData) {
        return this.http.post('', { data });
    }

    delete(id: number): Promise<unknown> {
        return this.http.delete('', { data: { chatId: id }});
    }


    read(): Promise<ChatInfo[]> {
        return this.http.get('');
    }

    getUsers(id: number): Promise<Array<User & { role: string }>> {
        return this.http.get(`${id}/users`)
    }

    addUsers(chatId: number, users: number[]): Promise<unknown> {
        return this.http.put('users', { data: { users, chatId }});
    }

    async getToken(chatId: number): Promise<string> {
        const response = await this.http.post<{ token: string }>(`token/${chatId}`);

        return response.token;
    }

}

export default new ChatsAPI();
