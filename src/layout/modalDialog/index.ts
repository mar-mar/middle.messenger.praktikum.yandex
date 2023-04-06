import { _Block } from "../../utils/_Block";
import template from "./index.hbs";
import styles from "./styles.module.pcss";

type ModalDialogProps = {
    title: string;
};

export default class ModalDialog extends _Block<ModalDialogProps> {

    protected getCompileOptions() {
        return { 
            template, 
            styles,
            hide: this.hide.bind(this)
        };
    }

}
