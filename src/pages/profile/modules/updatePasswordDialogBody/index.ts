import { _Block } from "../../../../utils/_Block";
import template from "./index.hbs";
import { WithFormProps, _BlockWithForm } from "../../../../utils/_BlockWithForm";
import { validatePassword } from '../../../../utils/validate';

export default class UpdatePasswordDialogBody<T extends  WithFormProps> extends _BlockWithForm<T> {

    protected getCompileOptions() {
        return {
            ...super.getCompileOptions(),
            template,
            validatePassword
         };
    }

}
