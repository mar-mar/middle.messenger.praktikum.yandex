
import { _Block } from '../../utils/_Block';
import template from './index.hbs';

export default class ProfilePage extends _Block {

    protected render() {
        return this.compile(template, {});
    }

}
