//import routeUse from "../../utils/route";
import Popup from "../../layout/popup";
import routeUse, { PAGES } from "../../utils/route";
import { _Block } from "../../utils/_Block";
import template from "./index.hbs";
import * as styles from './styles.module.pcss';

enum CHILD_NAMES {
    Attache = "popupAttache",
    ChatMenu = "popupChatMenu",
    Menu = "popupMenu",
    AddUser = "dialogAddUser",
    RemoveUser = "dialogRemoveUser",
    FindChat = "findChatDialogBody",
    CreateChat = "createChatDialogBody"
}

export default class IndexPage extends _Block {

    protected getCompileOptions() {
        return { 
            template, 
            styles,
            goLogin: this.go.bind(this, PAGES.Login),
            goSign: this.go.bind(this, PAGES.Sign),
            goProfile: this.go.bind(this, PAGES.Profile),
            goError404: this.go.bind(this, PAGES.Error404),
            goError500: this.go.bind(this, PAGES.Error500),
            openFindChat: this.openDialog.bind(this, CHILD_NAMES.FindChat),
            openCreateChat: this.openDialog.bind(this, CHILD_NAMES.CreateChat),

            attachMenuItems: this.attachMenuItems(),
            chatMenuMenuItems: this.chatMenuMenuItems(),
            menuMenuItems: this.menuMenuItems(),
            openPopupAttache: this.openPopup.bind(this, CHILD_NAMES.Attache),
            openPopupChatMenu: this.openPopup.bind(this, CHILD_NAMES.ChatMenu),
            openPopupMenu: this.openPopup.bind(this, CHILD_NAMES.Menu),
            CHILD_NAMES
        };
    }

    private go(page: PAGES): void {
        routeUse(page);
    }

    private openPopup(blockName: string, evt: Event) {
        if (!evt.target) return;
        const popup = this.getChildByAttacheNameOne(blockName);
        if (!popup) return;

        (popup as Popup).show({ parent: evt.target as Element });
    }

    private openDialog(blockName: string) {
        const dialog = this.getChildByAttacheNameOne(blockName);
        dialog?.show();
    }

    private attachMenuItems(): MenuItemTemplateProps[] {
        return [
            { label: "Фото или Видео"},
            { label: "Файл" },
            { label: "Локация" }
        ];
    }

    private chatMenuMenuItems(): MenuItemTemplateProps[] {
        return [
            { label: "Добавить пользователя", click: this.openDialog.bind(this, CHILD_NAMES.AddUser) },
            { label: "Удалить пользователя", click: this.openDialog.bind(this, CHILD_NAMES.RemoveUser) },
            { label: "Удалить чат" }
        ];
    }

    private menuMenuItems(): MenuItemTemplateProps[] {
        return [
            { label: "Создать чат", click: this.openDialog.bind(this, CHILD_NAMES.CreateChat) },
            { label: "Открыть профиль", click: this.go.bind(this, PAGES.Profile) }
        ];
    }
    
}
