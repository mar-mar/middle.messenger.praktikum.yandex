

import { _Block } from "../../../../utils/_Block";
import template from "./index.hbs";
import styles from './styles.module.pcss';

export default class MessageInput extends _Block {
    
    protected getCompileOptions() {
        return { template, styles };
    }
}
