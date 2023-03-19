//import { set } from './helpers';
import { EventBus } from './EventBus';
import { _Block } from './_Block';
import { User } from '../api/AuthAPI';
import { set } from "./merge";
import isEqual from "./isEqual";
import { ChatInfo } from '../api/ChatsAPI';
//import { Message } from '../controllers/MessagesController';

export enum StoreEvents {
    Updated = 'updated'
}

interface State {
    user: User;
    sleep: boolean;
    // 
    chats: Map<number, ChatInfo>;
    //messages: Record<number, Message[]>;
    selectedChat?: number;
}

export class Store extends EventBus {
    private state: any = {};

    public set(keypath: string, data: unknown) {
        set(this.state, keypath, data);

        this.emit(StoreEvents.Updated, this.getState());
    }

    public getState() {
        return this.state;
    }
}

const store = new Store();

// @ts-ignore
window.store = store;

export function withStore<SP extends RecordStrAny = any>(mapStateToProps: (state: State) => SP) {

    return function<P extends RecordStrAny = any>(Component: typeof _Block<{ item: SP } & P>) {

        // class WithStore
        return class WithStore extends Component {
 
            //
            constructor(props: Omit<P, keyof SP>) {

                let previousState = mapStateToProps(store.getState());

                //
                super({ ...(props as P), item: { ...previousState } });

                // store Updated
                store.on(StoreEvents.Updated, () => {
                    const newState = mapStateToProps(store.getState());

                    if (!isEqual(previousState, newState)) {
                        this.setProps({ item: { ...newState } } as Partial<{ item: SP; } & P>);
                    }
                    
                    previousState = newState;
                });

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
                let previousState = getStoreData(store.getState());

                store.on(StoreEvents.Updated, () => {
                    const newState = getStoreData(store.getState());

                    if (!isEqual(previousState, newState)) {
                        //this.setProps({ item: { ...newState } } as Partial<{ item: SP; } & P>);
                        this.emit(eventBusWithStoreEventName, { ...newState });
                    }
                    
                    previousState = newState;
                });
            }
            
        }
}

export default store;
