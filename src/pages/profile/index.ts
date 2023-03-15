import routeUse, { PAGES } from "../../utils/route";
import { withStore } from "../../utils/Store";
import { _Block } from "../../utils/_Block";
import template from "./index.hbs";
import * as styles from "./styles.module.pcss";


class ProfilePageBase  extends _Block {

    protected getCompileOptions() {
        return { 
            template,
            styles,
            goIndex: () => routeUse(PAGES.Index),
            logoff: () => routeUse(PAGES.Login),
            updatePassword: this.visibleChild.bind(this, true, "updatePassDialogBody"),
            updateAvatar: this.visibleChild.bind(this, true, "updateAvatarDialogBody"),
            ecexuteUpdataAvatar: this.visibleChild.bind(this, false, "updateAvatarDialogBody"),
            ecexuteUpdatePassword: this.visibleChild.bind(this, false, "updatePassDialogBody")
        };
    }

}

const withUser = withStore((state) => ({ ...state.user }))
const ProfilePage = withUser(ProfilePageBase);
export default ProfilePage;
