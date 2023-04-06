//import { set } from './helpers';
import { EventBus } from "./EventBus";
import { _Block } from "./_Block";
import { User } from "../api/AuthAPI";
import { set } from "./helpers/merge";
import isEqual from "./helpers/isEqual";
import { ChatInfo } from "../api/ChatsAPI";
import { Message } from "../controllers/MessagesController";
import cloneDeep from "./helpers/cloneDeep";
//import { Message } from '../controllers/MessagesController';

export enum StoreEvents {
    Updated = "updated"
}

interface State {
    user?: User;
    sleep?: boolean;
    chats?: Record<number, ChatInfo>; // не делать объектом, так как set(state, 'chats', { 33: {} }) не оставит один чат, а только добавит или обновит chats.33
    selectedChatId?: number;
    selectedChatUsers?: Map<number, User>; // user id, User

    messages?: Record<number, { // тут можно делать объектом, но аккуратно, для удаления чата делать - set(state, 'messages', { 33: undefined })
        messages: Message[],
        scrollMessage: Message[] // у сообщений странные идентификаторы, использую массив, чтобы перезаписать, а не смешать свойства двух сообщений
    }>
}

// в set все объекты мутабельные
// и только объекты - то есть ссылка остается постоянной и свойства примешиваются, не получится удалить какое-то свойство,
// то есть хранить обновляемые списки в массвах - нельзя
// массивы, Map, Set - иммутабельные, то подменяется один массив другим, тоже с Set и Map
export class Store extends EventBus {
    private state: State = {};

    public set(keypath: string, data: unknown) {

        set(this.state, keypath, data);

        this.emit(StoreEvents.Updated, this.getState());
    }

    public getState(): State {
        return this.state;
    }

    clear() {
        this.state = {};
        this.emit(StoreEvents.Updated, this.getState());
    }
}

const store = new Store();


export function withStore<SP extends RecordStrAny = any>(mapStateToProps: (state: State) => SP) {

    return function<P extends RecordStrAny = any>(Component: typeof _Block<{ storeItem: SP } & P>) {

        // class WithStore
        return class WithStore extends Component {
 
            private activeState: SP;
            onChangeStoreBind: (state: State) => void;

            constructor(props: Omit<P, keyof SP>) {

                const state = mapStateToProps(store.getState());
                const activeState = cloneDeep(state);
                //
                super({ ...(props as P), storeItem: state});

                this.activeState = activeState;

                // store Updated
                this.onChangeStoreBind = this.onChangeStore.bind(this);
                store.on(StoreEvents.Updated, this.onChangeStoreBind);

            }

            private onChangeStore() {
                const state = mapStateToProps(store.getState());

                if (!isEqual(this.activeState, state)) {

                    this.activeState = cloneDeep(state);

                    this.setProps({ storeItem: state } as Partial<{ storeItem: SP; } & P>);
                }
            }

            dispatchComponentDidUnMount() {
                store.off(StoreEvents.Updated, this.onChangeStoreBind);

                super.dispatchComponentDidUnMount();
            }

        }

    }
}

export const eventBusWithStoreEventName: string = "updateStore";

export function eventBusWithStore<D extends Record<string, any>>(getStoreData: (state: State) => D) {

        // class WithStore
    return class WithStore extends EventBus {
 
        constructor() {
            super();
            this.storeInit();
        }

        private storeInit(): void {
            let activeState = cloneDeep(getStoreData(store.getState()));

            store.on(StoreEvents.Updated, () => {
                const newState = getStoreData(store.getState());

                if (!isEqual(activeState, newState)) {
                    activeState = cloneDeep(newState);

                        //this.setProps({ item: { ...newState } } as Partial<{ item: SP; } & P>);
                    this.emit(eventBusWithStoreEventName, activeState);
                }
                    
                activeState = newState;
            });
        }
            
    }
}

export default store;
