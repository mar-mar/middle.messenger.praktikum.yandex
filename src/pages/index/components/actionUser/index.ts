import { _Block } from "../../../../utils/_Block";
import template from "./index.hbs";
import { _BlockWithForm } from "../../../../utils/_BlockWithForm";
import styles from "./styles.module.pcss";
import { User } from "../../../../api/AuthAPI";
import { isArray } from "../../../../utils/helpers/typeCheck";


type Props = {
    selectOptions?: { value: number, label: string }[];
    withResult?: boolean;
}

export type UserIdsData = {
    userId: string[] | string;
}

export default class ActionUser extends _BlockWithForm<UserIdsData, Props> {

    protected getCompileOptions() {
        return {
            ...super.getCompileOptions(),
            template,
            styles
         };
    }

    protected componentDidMount(/*oldProps*/): void { 
        this.setProps({ selectOptions: undefined, withResult: false });
    };

    protected getErrorBlock() {
        return this.getForm()?.getChildByAttacheNameOne("error");
    }
    
    setUsers(users?: User[]) {
        let selectOptions;

        if (users) {
            selectOptions = users.map(user => ({ label: `${user.first_name} ${user.second_name}`, value: user.id }));
        }

        this.setProps({ selectOptions, withResult: true });
    }


    toUserIds(values: UserIdsData) {
        let strUserIds = values.userId;
        if (!strUserIds) return;
        
        if (!isArray(strUserIds)) strUserIds = [strUserIds];

        return strUserIds.map(id => parseFloat(id));
    }
}
