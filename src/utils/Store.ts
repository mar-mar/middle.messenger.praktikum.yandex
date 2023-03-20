//import { set } from './helpers';
import { EventBus } from './EventBus';
import { _Block } from './_Block';
import { User } from '../api/AuthAPI';
import { set } from "./helpers/merge";
import isEqual from "./helpers/isEqual";
import { ChatInfo } from '../api/ChatsAPI';
import { Message } from "../controllers/MessagesController";
import cloneDeep from "./helpers/cloneDeep";
//import { Message } from '../controllers/MessagesController';

export enum StoreEvents {
    Updated = 'updated'
}

interface State {
    user?: User;
    sleep?: boolean;
    chats?: Record<number, ChatInfo>;
    selectedChatId?: number;

    messages?:  Record<number, {
        messages: Message[],
        scrollMessage: Message
    }>
}

export class Store extends EventBus {
    private state: State = {};

    public set(keypath: string, data: unknown) {
        set(this.state, keypath, data);

        this.emit(StoreEvents.Updated, this.getState());
    }

    public getState(): State {
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

                let activeState = cloneDeep(mapStateToProps(store.getState()));

                //
                super({ ...(props as P), item: activeState});

                // store Updated
                store.on(StoreEvents.Updated, () => {
                    const newState = mapStateToProps(store.getState());

                    if (!isEqual(activeState, newState)) {

                        activeState = cloneDeep(newState);

                        this.setProps({ item: activeState } as Partial<{ item: SP; } & P>);
                    }
                    
                    
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
