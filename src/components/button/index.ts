import { _Block } from '../../utils/_Block';
import template from './index.hbs';
import * as styles from "./styles.module.pcss";

type ButtonProps = {
    type?: string;
    label: string;
    events?: {
        click?: EventHandler;
    };
};


export default class Button extends _Block<ButtonProps> {

    protected getCompileOptions() {
        return { 
            template, 
            styles,
            type: "button" 
        };
    }

}
