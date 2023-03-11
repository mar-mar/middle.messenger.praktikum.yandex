import { _Block } from "../../../../utils/_Block";
import template from "./index.hbs";
import { WithFormProps, _BlockWithForm } from "../../../../utils/_BlockWithForm";
import * as styles from "./styles.module.pcss";

type UpdatePasswordDialogBodyProps = {
    fileName?: string;
} & WithFormProps;

export default class UpdatePasswordDialogBody extends _BlockWithForm<UpdatePasswordDialogBodyProps> {

    protected getCompileOptions() {
        
        return {
            ...super.getCompileOptions(),
            styles,
            template
         };
    }

}
