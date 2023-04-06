import { _Block } from "../../utils/_Block";
import template from "./index.hbs";
import { _BlockWithForm } from "../../utils/_BlockWithForm";
import styles from "./styles.module.pcss";
import { AvatarData } from "../../api/AvatarAPI";


export default class UpdatePasswordDialogBody extends _BlockWithForm<AvatarData, 
    { message: string; } > {

    protected getCompileOptions() {
        
        return {
            ...super.getCompileOptions(),
            styles,
            template
        };
    }

    protected componentDidMount(/*oldProps*/): void { 
        this.reset();
    }

    protected getErrorBlock() {
        return this.getForm()?.getChildByAttacheNameOne("error");
    }

}


