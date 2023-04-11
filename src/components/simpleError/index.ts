import { BlockProps, _Block } from "../../utils/_Block";
import template from "./index.hbs";
import styles from "./styles.module.pcss";

interface SimpleErrorProps extends BlockProps {
    error: string;
}

export default class SimpleError<T extends SimpleErrorProps = SimpleErrorProps> extends _Block<T> {

    protected getCompileOptions() {
        return { 
            template,
            styles
        };
    }
}
