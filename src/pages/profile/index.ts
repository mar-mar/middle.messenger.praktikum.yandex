import { AvatarData } from "../../api/AvatarUsersAPI";
import { PasswordData, ProfileUserData } from "../../api/UsersAPI";
import AuthController from "../../controllers/AuthController";
import UsersController from "../../controllers/UsersController";
import { withStore } from "../../utils/Store";
import { _Block } from "../../utils/_Block";
import { ErrorCallback } from "../../utils/_BlockWithForm";
import template from "./index.hbs";
import * as styles from "./styles.module.pcss";

enum ATTACHES {
    PASS_MODAL = "updatePassDialogBody",
    AVATAR_MODAL = "updateAvatarDialogBody"
};

class ProfilePageBase  extends _Block {

    protected getCompileOptions() {
        return { 
            template,
            styles,
            ATTACHES,
            
            logoff: this.logoff.bind(this),
            updatePassword: this.visibleChild.bind(this, true, ATTACHES.PASS_MODAL),
            updateAvatar: this.visibleChild.bind(this, true, ATTACHES.AVATAR_MODAL),

            ecexuteUpdataAvatar: this.ecexuteUpdataAvatar.bind(this),
            ecexuteUpdatePassword: this.ecexuteUpdatePassword.bind(this),
            ecexuteMainProps: this.ecexuteMainProps.bind(this)
        };
    }

    logoff() {
        AuthController.logout();
    }


    async ecexuteUpdataAvatar(values: AvatarData, errorCallback: ErrorCallback) {

        try {
            await UsersController.avatar(values);
        }
        catch(exp) {
            errorCallback(String(exp));
            return;
        }

        this.visibleChild(false, ATTACHES.AVATAR_MODAL);
    }

    async ecexuteUpdatePassword(values: PasswordData, errorCallback: ErrorCallback) {

        try {
            await UsersController.password(values);
        }
        catch(exp) {
            errorCallback(String(exp));
            return;
        }

        this.visibleChild(false, "updatePassDialogBody");
    }

    async ecexuteMainProps(values: ProfileUserData, errorCallback: ErrorCallback) {

        try {
            await UsersController.profile(values);
        }
        catch(exp) {
            errorCallback(String(exp));
        }
    }

}

const withUser = withStore((state) => ({ ...state.user }))
const ProfilePage = withUser(ProfilePageBase);
export default ProfilePage;
