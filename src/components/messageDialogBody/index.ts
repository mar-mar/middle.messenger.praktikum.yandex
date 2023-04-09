import { _Block } from "../../utils/_Block";
import template from "./index.hbs";
import { WithFormProps, _BlockWithForm } from "../../utils/_BlockWithForm";
import styles from "./styles.module.pcss";
import { AvatarData } from "../../api/AvatarAPI";
import SimpleError from "../simpleError";

interface UpdatePasswordDialogBodyProps<D> extends WithFormProps<D> {
    message: string;
}

export default class UpdatePasswordDialogBody<D extends AvatarData = AvatarData,
    T extends UpdatePasswordDialogBodyProps<D> = UpdatePasswordDialogBodyProps<D>> extends _BlockWithForm<D, T> {

    override getCompileOptions() {
        
        return {
            ...super.getCompileOptions(),
            styles,
            template
        };
    }

    override componentDidMount(/*oldProps*/): void { 
        this.reset();
    }

    override getErrorBlock() {
        return this.getForm()?.getChildByAttacheNameOne("error") as SimpleError;
    }

}


