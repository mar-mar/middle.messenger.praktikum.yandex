
import { WithFormProps, _BlockWithForm } from "../../../../utils/_BlockWithForm";
import template from "./index.hbs";
import styles from './styles.module.pcss';
import { validateMessage } from "../../../../utils/validate";
import routeUse, { PAGES } from "../../../../utils/route";


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

    protected execute() {
        routeUse(PAGES.Index);
    }

}
