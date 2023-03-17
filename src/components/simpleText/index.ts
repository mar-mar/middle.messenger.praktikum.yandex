import { _Block } from '../../utils/_Block';
import template from './index.hbs';

type SimpleTextProps = {
    text: string;
}

export default class SimpleText extends _Block<SimpleTextProps> {

    protected getCompileOptions() {
        return { 
            template
        };
    }
}
