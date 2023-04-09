import { User } from "../../../../api/AuthAPI";
import ResourceController from "../../../../controllers/ResourceController";
import UsersController from "../../../../controllers/UsersController";
import { withStore } from "../../../../utils/Store";
import { BlockProps, _Block } from "../../../../utils/_Block";
import template from "./index.hbs";
import styles from "./styles.module.pcss";

interface ProfileProps extends BlockProps { 
    
    openPopupMenu?: FunctionNoArgsNoReturn;
    storeItem: { user: User | undefined };
}

class ProfileBase extends _Block<ProfileProps> {
    
    protected getCompileOptions() {
    
        return { 
            template, 
            styles,
            getAvatar: () => {

                return ResourceController.getResourceURL(this.getProps().storeItem.user?.avatar);
            },
            getUserName: () => {
                
                const user = this.getProps().storeItem.user;
                return user ? UsersController.getUserName(user) : "";
            }   
            
        };
    }
}

const withUser = withStore(state => { 
    return {
        user: state.user
    }
});

const Profile = withUser(ProfileBase);
export default Profile;

