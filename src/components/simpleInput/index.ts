import { isHTMLInputElement } from "../../utils/typeCheck";
import { _Block } from '../../utils/_Block';
import template from './index.hbs';

type SimpleInputProps = {
    type: string;
    name: string;
    value?: string;
    parentClassName?: string;
    events?: {
        focus?: () => void;
        blur?: () => void;
    };
}


export default class SimpleInput extends _Block<SimpleInputProps> {

    protected getCompileOptions() {
        return { 
            template
        };
    }

    getValue() {
        const element = this.getElement();
        return isHTMLInputElement(element) ? element.value : null;
    }
    
}
