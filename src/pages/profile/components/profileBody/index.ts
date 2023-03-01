
import routeUse from "../../../../utils/route";
import { isEvent } from "../../../../utils/typeCheck";
import { _Block } from '../../../../utils/_Block';
import template from './index.hbs';
import styles from './styles.module.pcss';

export default class ProfileBody extends _Block {

    protected getCompileOptions() {
        return { template, styles };
    }

    onClickIndex(evt: any) {
        if (!isEvent(evt)) return;
        evt.preventDefault();

        routeUse("index");
    }

    onClickError404() {
        routeUse("error404");
    }

    onClickLogin() {
        routeUse("login");
    }


}
