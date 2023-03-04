import { Props, _Block } from '../../utils/_Block';
import template from './index.hbs';
import styles from './styles.module.pcss';

export type MenuItemProps = {
    label: string;
} & Props;

export default class MenuItem extends _Block<MenuItemProps> {

    protected getCompileOptions() {
        return { template, styles };
    }

}
