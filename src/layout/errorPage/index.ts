import { BlockProps, _Block } from "../../utils/_Block";
import template from "./index.hbs";
import styles from "./styles.module.pcss";
import RouterController from "../../controllers/RouterController";
import { PAGES_PATHS } from "../../utils/Router";

export interface ErrorPageLayoutProps extends BlockProps {
    errorCode?: string,
    message?: string
}


export default class ErrorPageLayout<T extends ErrorPageLayoutProps = ErrorPageLayoutProps> extends _Block<T> {

    protected getCompileOptions() {
        return { 
            template, 
            styles,
            goIndex: () => {
                
                RouterController.go(PAGES_PATHS.Messages);
                
            }
        };
    }

}
