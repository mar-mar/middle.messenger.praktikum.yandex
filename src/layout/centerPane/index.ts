import { BlockProps, _Block } from "../../utils/_Block";
import template from "./index.hbs";
import styles from "./styles.module.pcss";

interface CenterPaneLayoutProps extends BlockProps {
    noMarginTop?: 0|1;
    addeClassName?: string;
}

export default class CenterPaneLayout<T extends CenterPaneLayoutProps = CenterPaneLayoutProps> extends _Block<T> {

    protected getCompileOptions() {
        return { template, styles };
    }

}
