import ErrorPageLayout, { ErrorPageLayoutProps } from "../../layout/errorPage";
import { Props, _Block } from "../../utils/_Block";

    
export default class Error404Page<T extends ErrorPageLayoutProps> extends ErrorPageLayout<T> {

    constructor(props: Props<T>) {
        props = {
            ...props,
            errorCode: "404" ,
            message: "Не туда попали" 
        }
        super(props);
    }

}
