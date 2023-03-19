import { _Block } from "../../../../utils/_Block";
import template from "./index.hbs";
import { _BlockWithForm } from "../../../../utils/_BlockWithForm";


export default class RemoveUserDialogBody extends _BlockWithForm<Record<string, any>> {

    protected getCompileOptions() {
        return {
            ...super.getCompileOptions(),
            template
         };
    }

    protected getErrorBlock() {
        return this.getForm()?.getChildByAttacheNameOne("error");
    }
}
