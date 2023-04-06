import { _Block } from "../../utils/_Block";
import template from "./index.hbs";
import styles from "./styles.module.pcss";

type MultiSelectProps = {
    options?: { value: number, label: string }[];
    name?: string;
}

export default class MultiSelect extends _Block<MultiSelectProps> {

    protected getCompileOptions() {
        return { 
            template,
            styles
        };
    }
}
