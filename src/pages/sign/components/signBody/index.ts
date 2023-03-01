import routeUse from "../../../../utils/route";
import { _Block } from '../../../../utils/_Block';
import template from './index.hbs';

export default class SignBody extends _Block {

    protected getCompileOptions() {
        return { 
            template,
            onClickIndex: this.onClickIndex.bind(this)
        };
    }

    private onClickIndex(evt: Event): void {
        evt.preventDefault();

        routeUse("index");
    }
}
