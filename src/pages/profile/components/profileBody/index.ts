import routeUse from "../../../../utils/route";
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
            onClickIndex: this.onClickIndex.bind(this),
            onClickError404: this.onClickError404.bind(this),
            onClickLogin: this.onClickLogin.bind(this)
        };
    }

    protected getForm() {
        const form = this.getChildByAttacheNameOne("form");
        return this.isForm(form) ? form : null;
    }

    private onClickIndex(evt: Event): void {
        evt.preventDefault();

        routeUse("index");
    }

    private onClickError404(): void {
        routeUse("error404");
    }

    private onClickLogin(): void {
        routeUse("login");
    }


}
