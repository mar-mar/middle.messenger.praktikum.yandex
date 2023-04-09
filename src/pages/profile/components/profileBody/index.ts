import { WithFormProps, _BlockWithForm } from "../../../../utils/_BlockWithForm";
import template from "./index.hbs";
import styles from "./styles.module.pcss";
import { validateName, validateLogin, validateEmail, validatePhone } from "../../../../utils/validate";
import ResourceController from "../../../../controllers/ResourceController";
import { PasswordData, ProfileUserData } from "../../../../api/UsersAPI";
import { User } from "../../../../api/AuthAPI";
import UsersController from "../../../../controllers/UsersController";
import AuthController from "../../../../controllers/AuthController";
import SimpleError from "../../../../components/simpleError";
import { AvatarData } from "../../../../api/AvatarAPI";


interface ProfileBodyProps extends WithFormProps<ProfileUserData> { 

    updatePassword: (values?: PasswordData, errorCallback?: ErrorCallback) => void;
    updateAvatar: (values?: AvatarData, errorCallback?: ErrorCallback) => void;
    user: User | undefined
}

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
        return this.getForm()?.getChildByAttacheNameOne("error") as SimpleError;
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
