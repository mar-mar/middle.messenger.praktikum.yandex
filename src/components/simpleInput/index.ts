import { isHTMLInputElement } from "../../utils/helpers/typeCheck";
import { BlockProps, _Block } from "../../utils/_Block";
import template from "./index.hbs";


interface SimpleInputProps extends BlockProps {
    type: string;
    name: string;
    value?: string;
    accept?: string;
    addedClasses?: string;
    events?: {
        focus?: () => void;
        blur?: () => void;
        change?: ()=> void;
    };
}


export default class SimpleInput<T extends SimpleInputProps = SimpleInputProps> extends _Block<T> {

    protected getCompileOptions() {
        return { 
            ...super.getCompileOptions(),
            template
        };
    }

    getValue(): string | undefined {
        const element = this.getElement();
        return isHTMLInputElement(element) ? element.value : undefined;
    }
    
}
