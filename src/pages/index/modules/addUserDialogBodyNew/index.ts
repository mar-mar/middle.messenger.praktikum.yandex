import { _Block } from "../../../../utils/_Block";
import template from "./index.hbs";
import { ErrorCallback, _BlockWithForm } from "../../../../utils/_BlockWithForm";
import styles from "./styles.module.pcss";
import { SearchChatUsersData } from "../../../../api/ChatsAPI";
import { FilterData } from "../../components/actionUserFind";
import { UserIdsData } from "../../components/actionUser";
import { isFunction } from "../../../../utils/helpers/typeCheck";
import ActionUserFind from "../../components/actionUserFind";
import ActionUser from "../../components/actionUser";
import ChatsController from "../../../../controllers/ChatsController";
import UsersController from "../../../../controllers/UsersController";
import { validateFilterLogin } from "../../../../controllers/ValidateController";

type Props = {
    execute: () => void;
}


export default class FindChatDialogBody extends _BlockWithForm<SearchChatUsersData, Props> {

    protected getCompileOptions() {
        return {
            ...super.getCompileOptions(),
            template,
            styles,
            findExecute: this.findExecute.bind(this),
            actionExecute: this.actionExecute.bind(this),
            isValidFilter: validateFilterLogin
        };
    }

    private async findExecute(values: FilterData, errorCallback: ErrorCallback) {

        let users;
        try {
            users = await UsersController.search({ login: values.filter || "" });
        }
        catch(exp) {
            errorCallback(String(exp));
            return;
        }

        this.getActionBlock()?.setUsers(users);
    }

    private async actionExecute(values: UserIdsData, errorCallback: ErrorCallback) {
        
        const userIds = this.getActionBlock()?.toUserIds(values);
        if (!userIds) return;

        try {
            await ChatsController.addUserToSelectedChat(userIds);

        }
        catch(exp) {
            errorCallback(String(exp));
            return;
        }

        const execute = this.getProps().execute;
        if (isFunction(execute)) {
            execute();
        }
    }

    protected getFindBlock() {
        return this.getChildByAttacheNameOne("find") as ActionUserFind;
    }

    protected getActionBlock() {
        return this.getChildByAttacheNameOne("action") as ActionUser;
    }

}
