import ErrorPageLayout, { ErrorPageLayoutProps } from "../../layout/errorPage";
import { _Block } from "../../utils/_Block";

    
export default class Error500Page extends ErrorPageLayout<ErrorPageLayoutProps> {

    constructor(props: ErrorPageLayoutProps) {
        props = {
            ...props,
            errorCode: "500" ,
            message: "Мы уже исправляем" 
        }
        super(props);
    }

}
