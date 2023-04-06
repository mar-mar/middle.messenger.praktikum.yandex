import ErrorPageLayout, { ErrorPageLayoutProps } from "../../layout/errorPage";
import { Props, _Block } from "../../utils/_Block";

    
export default class Error500Page<T extends ErrorPageLayoutProps> extends ErrorPageLayout<T> {

    constructor(props: Props<T>) {
        props = {
            ...props,
            errorCode: "500" ,
            message: "Мы уже исправляем" 
        }
        super(props);
    }

}
