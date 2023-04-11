import { BlockProps, _Block } from "../../utils/_Block";
import template from "./index.hbs";
import styles from "./styles.module.pcss";


interface MenuProps extends BlockProps {
    menuItems?: MenuItemTemplateProps
}

export default class Menu extends _Block<MenuProps> {

    protected getCompileOptions() {
        return { 
            template,
            styles 
        };
    }

}
