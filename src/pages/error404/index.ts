import ErrorPageLayout, { ErrorPageLayoutProps } from "../../layout/errorPage";
import { _Block } from "../../utils/_Block";
    
export default class Error404Page extends ErrorPageLayout<ErrorPageLayoutProps> {

    constructor(props: ErrorPageLayoutProps) {
        props = {
            ...props,
            errorCode: "404" ,
            message: "Не туда попали" 
        }
        super(props);
    }

}
