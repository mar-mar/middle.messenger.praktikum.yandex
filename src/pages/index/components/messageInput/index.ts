
import { WithFormProps, _BlockWithForm } from "../../../../utils/_BlockWithForm";
import template from "./index.hbs";
import * as styles from "./styles.module.pcss";
import { validateMessage } from "../../../../utils/validate";


type MessageInputProps = {
    openPopupAttache: FunctionNoArgsNoReturn
} & WithFormProps;

export default class MessageInput  extends _BlockWithForm<MessageInputProps> {   
    
    protected getCompileOptions() {
        return {
            ...super.getCompileOptions(),
            template,
            styles,
            validateMessage
         };
    }

}
