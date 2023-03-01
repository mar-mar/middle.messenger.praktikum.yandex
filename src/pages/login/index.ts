import routeUse from "../../utils/route";
import { _Block } from "../../utils/_Block";
import template from "./index.hbs";

export default class LoginPage extends _Block {
    
    protected getCompileOptions() {
        return { template };
    }

    onClickSign() {
        routeUse("sign");
    }
}
