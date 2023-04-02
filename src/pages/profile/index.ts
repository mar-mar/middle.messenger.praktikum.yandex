import { User } from "../../api/AuthAPI";
import { AvatarData } from "../../api/AvatarAPI";
import UsersController from "../../controllers/UsersController";
import routeUse, { PAGES } from "../../utils/route";
import { withStore } from "../../utils/Store";
import { _Block } from "../../utils/_Block";
import { ErrorCallback } from "../../utils/_BlockWithForm";
import template from "./index.hbs";
import * as styles from "./styles.module.pcss";

enum ATTACHES {
    PASS_MODAL = "updatePassDialogBody",
    AVATAR_MODAL = "updateAvatarDialogBody"
};

type Props = {
    storeItem: {
        user: User | undefined;
    }
}

class ProfilePageBase extends _Block<Props> {

    protected getCompileOptions() {
        return {
            template,
            styles,
            ATTACHES,

            goMess: () => routeUse(PAGES.Messages),

            updatePassword: this.visibleChild.bind(this, true, ATTACHES.PASS_MODAL),
            updateAvatar: this.visibleChild.bind(this, true, ATTACHES.AVATAR_MODAL),

            ecexuteUpdataAvatar: this.ecexuteUpdataAvatar.bind(this),
            ecexuteUpdatePassword: this.visibleChild.bind(this, false, ATTACHES.PASS_MODAL),
        };
    }

    async ecexuteUpdataAvatar(values: AvatarData, errorCallback: ErrorCallback) {

        try {
            await UsersController.avatar(values);
        }
        catch (exp) {
            errorCallback(String(exp));
            return;
        }

        this.visibleChild(false, ATTACHES.AVATAR_MODAL);
    }

}

const withUser = withStore((state) => {
    return {
        user: state.user
    }
})
const ProfilePage = withUser(ProfilePageBase);
export default ProfilePage;
