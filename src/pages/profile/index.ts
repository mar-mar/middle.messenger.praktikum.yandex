import { User } from "../../api/AuthAPI";
import { AvatarData } from "../../api/AvatarAPI";
import UsersController from "../../controllers/UsersController";
import { withStore } from "../../utils/Store";
import { BlockProps, _Block } from "../../utils/_Block";
import { ErrorCallback } from "../../utils/_BlockWithForm";
import template from "./index.hbs";
import styles from "./styles.module.pcss";
import RouterController from "../../controllers/RouterController";
import { PAGES_PATHS } from "../../utils/Router";

enum ATTACHES {
    PASS_MODAL = "updatePassDialogBody",
    AVATAR_MODAL = "updateAvatarDialogBody"
}

interface Props<SP> extends BlockProps {
    storeItem: SP;
}

type StoreItem = {
    user: User | undefined;
}

class ProfilePageBase<T extends Props<StoreItem> = Props<StoreItem>> extends _Block<T> {

    protected getCompileOptions() {
        return {
            template,
            styles,
            ATTACHES,

            goMess: () => RouterController.go(PAGES_PATHS.Messages),

            updatePassword: this.visibleChild.bind(this, true, ATTACHES.PASS_MODAL),
            updateAvatar: this.visibleChild.bind(this, true, ATTACHES.AVATAR_MODAL),

            ecexuteUpdataAvatar: this.ecexuteUpdataAvatar.bind(this),
            ecexuteUpdatePassword: this.visibleChild.bind(this, false, ATTACHES.PASS_MODAL)
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

const withUser = withStore<StoreItem>((state) => {
    return {
        user: state.user
    }
})
const ProfilePage = withUser<Props<StoreItem>>(ProfilePageBase);

export default ProfilePage;
