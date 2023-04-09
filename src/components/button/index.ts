import { BlockProps, _Block } from "../../utils/_Block";
import template from "./index.hbs";
import styles from "./styles.module.pcss";


interface ButtonProps extends BlockProps {
    type?: string;
    label: string;
    events?: {
        click?: DOMEventHandler;
    };
}

export default class Button extends _Block<ButtonProps> {

    protected getCompileOptions() {
        return { 
            template, 
            styles,
            type: "button" 
        };
    }

}
