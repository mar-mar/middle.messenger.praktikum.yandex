import { BlockProps, _Block } from "../../utils/_Block";
import template from "./index.hbs";
import styles from "./styles.module.pcss";

interface MenuItemProps extends BlockProps {
    label: string;
    events?: {
        click?: DOMEventHandler
    }
}

export default class MenuItem extends _Block<MenuItemProps> {

    protected getCompileOptions() {
        return { template, styles };
    }

}
