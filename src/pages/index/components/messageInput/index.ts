
import { WithFormProps, _BlockWithForm } from "../../../../utils/_BlockWithForm";
import template from "./index.hbs";
import styles from './styles.module.pcss';
import { validateMessage } from "../../../../utils/validate";

export default class MessageInput<T extends WithFormProps>  extends _BlockWithForm<T> {   
    
    protected getCompileOptions() {
        return {
            ...super.getCompileOptions(),
            template,
            styles,
            validateMessage
         };
    }
}
