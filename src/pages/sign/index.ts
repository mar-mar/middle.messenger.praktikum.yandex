
import routeUse from "../../utils/route";
import { _Block } from '../../utils/_Block';
import template from './index.hbs';

export default class SignPage extends _Block {

    protected getCompileOptions() {
        return { 
            template,
            onClickLogin: this.onClickLogin.bind(this)
        };
    }

    private onClickLogin(): void {
        routeUse("login");
    }
}
