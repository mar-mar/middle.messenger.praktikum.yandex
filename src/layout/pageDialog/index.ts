import { BlockProps, _Block } from "../../utils/_Block";
import template from "./index.hbs";
import styles from "./styles.module.pcss";

interface PageDialogeProps extends BlockProps {
    title: string;
}

export default class PageDialogeLayout<T extends PageDialogeProps = PageDialogeProps> extends _Block<T> {

    protected getCompileOptions() {
        return { template, styles };
    }

}
