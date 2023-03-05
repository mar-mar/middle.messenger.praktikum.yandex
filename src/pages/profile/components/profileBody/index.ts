import { _Block } from '../../../../utils/_Block';
import { WithFormProps, _BlockWithForm } from "../../../../utils/_BlockWithForm";
import template from './index.hbs';
import styles from './styles.module.pcss';
import { validateName, validateLogin, validateEmail, validatePhone } from '../../../../utils/validate';


type Props = {
    logoff: AnyFunctionNoReturn;
    updatePassword: AnyFunctionNoReturn;
    updateAvatar: AnyFunctionNoReturn;
} & WithFormProps

export default class ProfileBody extends _BlockWithForm<Props> {
    
    protected getCompileOptions() {
        return { 
            ...super.getCompileOptions(),
            template,
            styles,
            validateName,
            validateLogin,
            validateEmail,
            validatePhone
        };
    }
}
