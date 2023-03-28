import { _Block } from '../../../../utils/_Block';
import { _BlockWithForm } from "../../../../utils/_BlockWithForm";
import template from './index.hbs';
import * as styles from "./styles.module.pcss";
import { validateName, validateLogin, validateEmail, validatePhone } from '../../../../utils/validate';
import ResourceController from "../../../../controllers/ResourceController";
import { ProfileUserData } from "../../../../api/UsersAPI";
import { User } from "../../../../api/AuthAPI";
import UsersController from "../../../../controllers/UsersController";
import AuthController from "../../../../controllers/AuthController";


type ProfileBodyProps = {
    updatePassword: AnyFunctionNoReturn;
    updateAvatar: AnyFunctionNoReturn;
    user: User | undefined
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
                return ResourceController.getResourceURL(this.getProps().user?.avatar);
            },
            logout: this.logout.bind(this)
        };
    }

    logout() {
        AuthController.logout();
    }

    protected getErrorBlock() {
        return this.getForm()?.getChildByAttacheNameOne("error");
    }

    async execute(values: ProfileUserData) {
        if (!values) return;

        try {
            await UsersController.profile(values);
        }
        catch (exp) {
            this.errorCallback(String(exp));
        }

        super.execute(values);
    }
}
