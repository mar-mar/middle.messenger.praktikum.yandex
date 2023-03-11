

import { _Block } from "../../../../utils/_Block";
import template from "./index.hbs";
import * as styles from "./styles.module.pcss";

export default class ChatItem extends _Block {
    
    protected getCompileOptions() {
        return { template, styles };
    }
}
