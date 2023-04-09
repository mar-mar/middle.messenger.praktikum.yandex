import { BlockProps, _Block } from "../../utils/_Block";
import template from "./index.hbs";
import styles from "./styles.module.pcss";

interface PaneLayoutProps extends BlockProps {
    secBackColor?: 0|1;
    noBorder?: 0|1;
    addeClassName?: string;
}


export default class PaneLayout<T extends PaneLayoutProps = PaneLayoutProps> extends _Block<T> {

    protected getCompileOptions() {
        return { template, styles };
    }

}
