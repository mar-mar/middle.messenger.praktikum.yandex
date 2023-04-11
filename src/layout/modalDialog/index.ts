import { BlockProps, _Block } from "../../utils/_Block";
import template from "./index.hbs";
import styles from "./styles.module.pcss";

interface ModalDialogProps extends BlockProps {
    title: string;
}

export default class ModalDialog<T extends ModalDialogProps = ModalDialogProps> extends _Block<T> {

    protected getCompileOptions() {
        return { 
            template, 
            styles,
            hide: this.hide.bind(this)
        };
    }

}
