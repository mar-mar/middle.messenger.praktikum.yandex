import { _Block } from "../../../../utils/_Block";
import template from "./index.hbs";
import { ErrorCallback, _BlockWithForm } from "../../../../utils/_BlockWithForm";
import * as styles from "./styles.module.pcss";
import { SearchChatUsersData } from "../../../../api/ChatsAPI";
import { isFunction } from "../../../../utils/helpers/typeCheck";
import ActionUserFind, { FilterData } from "../../components/actionUserFind";
import ActionUser, { UserIdsData } from "../../components/actionUser";
import ChatsController from "../../../../controllers/ChatsController";
import { validateFilterName } from "../../../../controllers/ValidateController";



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
            isValidFilter: validateFilterName
         };
    }

    private async findExecute(values: FilterData, errorCallback: ErrorCallback) {

        let users;
        try {
            users = await ChatsController.searchChatUsers({ name: values.filter || "", limit: 50 });
        }
        catch(exp) {
            errorCallback(String(exp));
            return;
        }

        this.getRemoveBlock()?.setUsers(users);
    }

    private async actionExecute(values: UserIdsData, errorCallback: ErrorCallback) {
        
        const userIds = this.getRemoveBlock()?.toUserIds(values);
        if (!userIds) return;

        try {
            await ChatsController.removeUserFromSelectedChat(userIds);

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

    protected getRemoveBlock() {
        return this.getChildByAttacheNameOne("action") as ActionUser;
    }


}
