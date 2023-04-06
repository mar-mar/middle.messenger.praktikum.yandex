import { _Block } from "../../utils/_Block";
import template from "./index.hbs";
import styles from "./styles.module.pcss";

type TextButtonProps = {
    datasetId?: string;
    type?: string;
    name?: string;
    value?: string;
    label?: string;
    noLabel?: 0|1;
    red?: 0|1;
    iconClass?: string;
    addeClassName?: string;

    events?: {
        click?: EventHandler
    }
}

export default class TextButton extends _Block<TextButtonProps> {

    protected getCompileOptions() {
        return { 
            template, 
            styles,
            type: "button" 
        };
    }
}
