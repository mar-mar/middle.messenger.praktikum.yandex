import { BlockProps, _Block } from "../../utils/_Block";
import template from "./index.hbs";

interface SimpleTextProps extends BlockProps {
    text: string;
}

export default class SimpleText<T extends SimpleTextProps = SimpleTextProps> extends _Block<T> {

    protected getCompileOptions() {
        return { 
            template
        };
    }
}
