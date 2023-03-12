//import { set } from './helpers';
import { EventBus } from './EventBus';
import { _Block } from './_Block';
import { User } from '../api/AuthAPI';
import { set } from "./merge";
//import { ChatInfo } from '../api/ChatsAPI';
//import { Message } from '../controllers/MessagesController';

export enum StoreEvents {
    Updated = 'updated'
}

interface State {
    user: User;
    //chats: ChatInfo[];
    //messages: Record<number, Message[]>;
    //selectedChat?: number;
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

    return function<P extends RecordStrAny = any>(Component: typeof _Block<SP & P>) {

        return class WithStore extends Component {
 
            constructor(props: Omit<P, keyof SP>) {
                let previousState = mapStateToProps(store.getState());

                super({ ...(props as P), ...previousState });

                // store Updated
                store.on(StoreEvents.Updated, () => {
                    const stateProps = mapStateToProps(store.getState());

                    previousState = stateProps;

                    this.setProps({ ...(stateProps as Partial<SP & P>) });
                });

            }

        }

    }
}

export default store;
