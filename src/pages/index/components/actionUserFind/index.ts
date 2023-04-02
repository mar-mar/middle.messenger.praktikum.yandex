import { _Block } from "../../../../utils/_Block";
import template from "./index.hbs";
import { _BlockWithForm } from "../../../../utils/_BlockWithForm";
import * as styles from "./styles.module.pcss";

export type FilterData = {
    filter?: string;
}

type Props = {
    filter ?: string;
    filterLabel ?: string;
}

export default class ActionUserFind extends _BlockWithForm<FilterData, Props> {

    protected getCompileOptions() {
        return {
            ...super.getCompileOptions(),
            template,
            styles
         };
    }

    protected componentDidMount(/*oldProps*/): void { 
        this.reset();
    };

    protected getErrorBlock() {
        return this.getForm()?.getChildByAttacheNameOne("error");
    }

}
