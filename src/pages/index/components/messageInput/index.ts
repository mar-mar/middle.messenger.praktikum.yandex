
import { WithFormProps, _BlockWithForm } from "../../../../utils/_BlockWithForm";
import template from "./index.hbs";
import styles from './styles.module.pcss';
import { validateMessage } from "../../../../utils/validate";


type MessageInputProps = {
    openPopup: (element: Element) => void
} & WithFormProps;

export default class MessageInput<T extends MessageInputProps>  extends _BlockWithForm<T> {   
    
    protected getCompileOptions() {
        return {
            ...super.getCompileOptions(),
            template,
            styles,
            validateMessage
         };
    }

}
