import { _Block } from "../../utils/_Block";
import template from "./index.hbs";
import { _BlockWithForm } from "../../utils/_BlockWithForm";
import styles from "./styles.module.pcss";
import { AvatarData } from "../../api/AvatarAPI";
import { isHTMLInputElement } from "../../utils/helpers/typeCheck";
import SimpleText from "../simpleText";
import SimpleError from "../simpleError";


export default class UpdatePasswordDialogBody extends _BlockWithForm<AvatarData> {

    protected getCompileOptions() {
        
        return {
            ...super.getCompileOptions(),
            styles,
            changeFile: this.changeFile.bind(this),
            template
        };
    }

    protected componentDidMount(/*oldProps*/): void { 
        this.reset();
    }

    private changeFile(evt: Event) {

        if (!isHTMLInputElement(evt.target)) return;

        const textBlock = this.getForm()?.getChildByAttacheNameOne(["avatarFileNamePane", "avatarFileName"]) as SimpleText;
        if (!textBlock) return;

        const file = evt.target.files?.[0];


        textBlock.setProps({ text: file ? file.name : "файл не выбран" })
    }

    override getErrorBlock() {
        return this.getForm()?.getChildByAttacheNameOne("error") as SimpleError;
    }


}


