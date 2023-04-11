import { BlockProps, _Block } from "../../utils/_Block";
import template from "./index.hbs";
import styles from "./styles.module.pcss";

interface AvatarProps extends BlockProps {
    clickLabel?: string;
    diameter?: string;
    addedClassName?: string;
    imageUrl?: string;
    avatarOwner?: string;
    events?: {
        click?: DOMEventHandler;
    };
}

export default class Avatar extends _Block<AvatarProps> {

    protected getCompileOptions() {

        return { 
            template, 
            styles,
            getDiameterClassName: (): string => {
                const diameter = this.getProps().diameter;
                return styles[`root--${diameter}`];
            }
        };
    }
    
}
