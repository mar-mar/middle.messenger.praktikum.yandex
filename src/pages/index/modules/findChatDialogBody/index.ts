import { _Block } from "../../../../utils/_Block";
import template from "./index.hbs";
import { WithFormProps, _BlockWithForm } from "../../../../utils/_BlockWithForm";
import * as styles from "./styles.module.pcss";


export default class FindChatDialogBody<T extends WithFormProps>  extends _BlockWithForm<T> {

    protected getCompileOptions() {
        return {
            ...super.getCompileOptions(),
            template,
            styles
         };
    }
}
