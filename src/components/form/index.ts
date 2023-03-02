import { _Block } from '../../utils/_Block';
import { _ValidatedBlock } from "../../utils/_ValidatedBlock";
import template from './index.hbs';
import styles from './styles.module.pcss';

export default class CenterPaneLayout extends _Block {

    protected getCompileOptions() {
        return { template, styles };
    }

    public validate(): void {
        this.forEachChildren((child: _Block) => {

            if (child instanceof _ValidatedBlock) {

                child.validate();
            }
        });
    }
}
