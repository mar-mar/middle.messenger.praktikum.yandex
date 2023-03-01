
import routeUse from "../../utils/route";
import { isEvent } from "../../utils/typeCheck";
import { _Block } from "../../utils/_Block";
import template from "./index.hbs";

export default class ProfilePage extends _Block {

    protected getCompileOptions() {
        return { template };
    }

    onClickIndex(evt: any) {
        if (!isEvent(evt)) return;
        evt.preventDefault();

        routeUse("index");
    }
}
