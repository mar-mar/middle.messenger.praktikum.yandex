import { BlockProps, _Block } from "../../utils/_Block";
import template from "./index.hbs";
import styles from "./styles.module.pcss";


interface MultiSelectProps extends BlockProps {
    options?: { value: number, label: string }[];
    name?: string;
}


export default class MultiSelect<T extends MultiSelectProps = MultiSelectProps> extends _Block<T> {

    protected getCompileOptions() {
        return { 
            template,
            styles
        };
    }
}
