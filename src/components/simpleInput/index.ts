import { isHTMLInputElement } from "../../utils/typeCheck";
import { _Block } from '../../utils/_Block';
import template from './index.hbs';


interface SimpleInputProps {
    type?: string;
    key: string;
    events: {
        focus?: () => void;
        blur?: () => void;
    };
}


export default class Input extends _Block<SimpleInputProps> {

    validate: any = null;

    protected getCompileOptions() {
        return { 
            template, 
            type: "text"
        };
    }

    getValue() {
        const element = this.getElement();
        return isHTMLInputElement(element) ? element.value : null;
    }
    
    //validate
}
