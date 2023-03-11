import routeUse, { PAGES } from "../../utils/route";
import { _Block } from "../../utils/_Block";
import template from "./index.hbs";
import * as styles from "./styles.module.pcss";


export default class ProfilePage  extends _Block {

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
