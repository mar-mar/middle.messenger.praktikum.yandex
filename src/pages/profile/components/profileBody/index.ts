import routeUse, { PAGES } from "../../../../utils/route";
import { _Block } from '../../../../utils/_Block';
import { WithFormProps, _BlockWithForm } from "../../../../utils/_BlockWithForm";
import template from './index.hbs';
import styles from './styles.module.pcss';
import { validateName, validateLogin, validateEmail, validatePhone } from '../../../../utils/validate';

export default class ProfileBody<T extends WithFormProps> extends _BlockWithForm<T> {
    

    protected getCompileOptions() {
        return { 
            ...super.getCompileOptions(),
            template,
            styles,
            validateName,
            validateLogin,
            validateEmail,
            validatePhone,
            goLogin: () => { routeUse(PAGES.Login) }
        };
    }

    protected execute() {
        routeUse(PAGES.Index);
    }
}
