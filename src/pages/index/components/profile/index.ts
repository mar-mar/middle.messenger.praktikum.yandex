import { User } from "../../../../api/AuthAPI";
import UsersController from "../../../../controllers/UsersController";
import { withStore } from "../../../../utils/Store";
import { _Block } from "../../../../utils/_Block";
import template from "./index.hbs";
import * as styles from "./styles.module.pcss";

type ProfileProps = {
    openPopupMenu?: FunctionNoArgsNoReturn;
    item: User
};

class ProfileBase extends _Block<ProfileProps> {
    
    protected getCompileOptions() {
    
        return { 
            template, 
            styles,
            getAvatar: ()=> {
                return UsersController.getAvatarURL(this.getProps().item.avatar);
            }
        };
    }
}

const withUser = withStore((state) => ({ ...state.user }))
const Profile = withUser(ProfileBase);
export default Profile;

