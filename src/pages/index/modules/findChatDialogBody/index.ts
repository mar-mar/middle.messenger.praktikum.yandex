import { _Block } from "../../../../utils/_Block";
import template from "./index.hbs";
import { _BlockWithForm } from "../../../../utils/_BlockWithForm";
import * as styles from "./styles.module.pcss";


export default class FindChatDialogBody extends _BlockWithForm<Record<string, any>> {

    protected getCompileOptions() {
        return {
            ...super.getCompileOptions(),
            template,
            styles
         };
    }
}
