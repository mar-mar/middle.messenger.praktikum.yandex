import { _Block } from "../../../../utils/_Block";
import template from "./index.hbs";
import { WithFormProps, _BlockWithForm } from "../../../../utils/_BlockWithForm";
import styles from './styles.module.pcss';


export default class UpdatePasswordDialogBody<T extends  WithFormProps> extends _BlockWithForm<T> {

    protected getCompileOptions() {
        debugger
        console.info(styles);
        return {
            ...super.getCompileOptions(),
            styles,
            template
         };
    }

}
