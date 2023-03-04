import { Props, _Block } from '../../utils/_Block';
import template from './index.hbs';
import styles from './styles.module.pcss';

type AvatarProps = {
    clickLabel?: string;
    diameter?: string;
    addedClassName?: string;
    imageUrl?: string;
    avatarOwner?: string;
} & Props;

export default class Avatar extends _Block<AvatarProps> {

    protected getCompileOptions() {
        return { template, styles };
    }
    
}
