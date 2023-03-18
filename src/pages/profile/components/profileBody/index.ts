import { _Block } from '../../../../utils/_Block';
import { _BlockWithForm } from "../../../../utils/_BlockWithForm";
import template from './index.hbs';
import * as styles from "./styles.module.pcss";
import { validateName, validateLogin, validateEmail, validatePhone } from '../../../../utils/validate';
import UsersController from "../../../../controllers/UsersController";
import { ProfileUserData } from "../../../../api/UsersAPI";
import { User } from "../../../../api/AuthAPI";


type ProfileBodyProps = {
    logoff: AnyFunctionNoReturn;
    updatePassword: AnyFunctionNoReturn;
    updateAvatar: AnyFunctionNoReturn;
    item: User
};

export default class ProfileBody extends _BlockWithForm<ProfileUserData, ProfileBodyProps> {
    
    

    protected getCompileOptions() {
        return { 
            ...super.getCompileOptions(),
            template,
            styles,
            validateName,
            validateLogin,
            validateEmail,
            validatePhone,
            getAvatar: ()=> {
                return UsersController.getAvatarURL(this.getProps().item.avatar);
            }
        };
    }

    protected getErrorBlock() {
        return this.getForm()?.getChildByAttacheNameOne("error");
    }
}
