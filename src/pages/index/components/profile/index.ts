import { _Block } from "../../../../utils/_Block";
import template from "./index.hbs";
import * as styles from "./styles.module.pcss";

type ProfileProps = {
    openPopupMenu?: FunctionNoArgsNoReturn;
};

export default class Profile extends _Block<ProfileProps> {
    
    protected getCompileOptions() {
        return { template, styles };
    }
}
