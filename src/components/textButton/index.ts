import { BlockProps, _Block } from "../../utils/_Block";
import template from "./index.hbs";
import styles from "./styles.module.pcss";

interface TextButtonProps extends BlockProps {
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
        click?: DOMEventHandler
    }
}

export default class TextButton<T extends TextButtonProps = TextButtonProps> extends _Block<T> {

    override getCompileOptions() {
        return { 
            template, 
            styles,
            type: "button" 
        };
    }
}
