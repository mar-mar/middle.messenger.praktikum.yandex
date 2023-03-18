import { _Block } from "../../../../utils/_Block";
import template from "./index.hbs";
import { _BlockWithForm } from "../../../../utils/_BlockWithForm";
import * as styles from "./styles.module.pcss";
import { AvatarData } from "../../../../api/AvatarUsersAPI";
import { isHTMLInputElement } from "../../../../utils/typeCheck";


export default class UpdatePasswordDialogBody extends _BlockWithForm<AvatarData, { item?: { fileName?: string, file?: string } } > {

    protected getCompileOptions() {
        
        return {
            ...super.getCompileOptions(),
            styles,
            changeFile: this.changeFile.bind(this),
            template,
            avatarFileName: "файл не выбран"
         };
    }

    protected componentDidMount(/*oldProps*/): void { 
        this.setProps({ item: {} });
    };

    private changeFile(evt: Event) {

        if (!isHTMLInputElement(evt.target)) return;

        const textBlock = this.getForm()?.getChildByAttacheNameOne(["avatarFileNamePane", "avatarFileName"]);
        if (!textBlock) return;

        const file = evt.target.files?.[0];

        textBlock.setProps({ text: file ? file.name : "файл не выбран" })
    }

    protected getErrorBlock() {
        return this.getForm()?.getChildByAttacheNameOne("error");
    }


}


