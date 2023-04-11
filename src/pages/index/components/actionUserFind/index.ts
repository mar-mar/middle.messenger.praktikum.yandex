import { _Block } from "../../../../utils/_Block";
import template from "./index.hbs";
import { WithFormProps, _BlockWithForm } from "../../../../utils/_BlockWithForm";
import styles from "./styles.module.pcss";
import SimpleError from "../../../../components/simpleError";

export type FilterData = {
    filter?: string;
}


export interface Props extends WithFormProps<FilterData> {
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
    }

    protected getErrorBlock() {
        return this.getForm()?.getChildByAttacheNameOne("error") as SimpleError;
    }

}
