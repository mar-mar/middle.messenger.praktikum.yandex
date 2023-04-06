import { _Block } from "../../utils/_Block";
import template from "./index.hbs";
import styles from "./styles.module.pcss";

type CenterPaneLayoutProps = {
    noMarginTop?: 0|1;
    addeClassName?: string;
};

export default class CenterPaneLayout extends _Block<CenterPaneLayoutProps> {

    protected getCompileOptions() {
        return { template, styles };
    }

}
