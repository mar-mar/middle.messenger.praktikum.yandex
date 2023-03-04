//import routeUse from "../../utils/route";
import { MenuItemProps } from "../../components/menuItem";
import Popup from "../../layout/popup";
import routeUse from "../../utils/route";
import { _Block } from "../../utils/_Block";
import template from "./index.hbs";
import * as styles from './styles.module.pcss';

enum CHILD_NAMES {
    Attache = "popupAttache",
    ChatMenu = "popupChatMenu",
    Menu = "popupMenu",
    AddUser = "dialogAddUser",
    DeleteUser = "dialogDeleteUser",
    FindChat = "findChatDialogBody"
}

export default class IndexPage extends _Block {

    protected getCompileOptions() {
        return { 
            template, 
            styles,
            onClickLogin: this.onClickLogin.bind(this),
            onClickSign: this.onClickSign.bind(this),
            onClickProfile: this.onClickProfile.bind(this),
            onClickError404: this.onClickError404.bind(this),
            onClickError500: this.onClickError500.bind(this),
            openFindChat: this.openFindChat.bind(this),
            attachMenuItems: this.attachMenuItems(),
            chatMenuMenuItems: this.chatMenuMenuItems(),
            menuMenuItems: this.menuMenuItems(),
            openPopupAttache: this.openPopupAttache.bind(this),
            openPopupChatMenu: this.openPopupChatMenu.bind(this),
            openPopupMenu: this.openPopupMenu.bind(this),
            CHILD_NAMES
        };
    }

    private onClickLogin(): void {
        routeUse("login");
    }

    private onClickSign(): void {
        routeUse("sign");
    }

    private onClickProfile(): void {
        routeUse("profile");
    }

    private onClickError404(): void {
        routeUse("error404");
    }

    private onClickError500(): void {
        routeUse("error500"); 
    }

    private onClickAddUser() {
        this.openDialog(CHILD_NAMES.AddUser);
    }

    private onClickDeleteUser() {
        this.openDialog(CHILD_NAMES.DeleteUser);
    }

    private openFindChat() {
        this.openDialog(CHILD_NAMES.FindChat);
    }
    
    private openPopupAttache(evt: Event): void {
        //evt.preventDefault();
        this.openPopup(evt, CHILD_NAMES.Attache);
    }

    private openPopupChatMenu(evt: Event): void {
        this.openPopup(evt, CHILD_NAMES.ChatMenu);
    }

    private openPopupMenu(evt: Event): void {
        this.openPopup(evt, CHILD_NAMES.Menu);
    }

    private openPopup(evt: Event, blockName: string) {
        if (!evt.target) return;
        const popup = this.getChildByAttacheNameOne(blockName) as Popup;
        popup?.show(evt.target as Element);
    }

    private openDialog(blockName: string) {
        const dialog = this.getChildByAttacheNameOne(blockName) as Popup;
        dialog.show();
    }

    private attachMenuItems(): MenuItemProps[] {
        return [
            { label: "Фото или Видео"},
            { label: "Файл" },
            { label: "Локация" }
        ];
    }

    private chatMenuMenuItems(): MenuItemProps[] {
        return [
            { label: "Добавить пользователя", click: this.onClickAddUser.bind(this) },
            { label: "Удалить пользователя", click: this.onClickDeleteUser.bind(this) },
            { label: "Удалить чат" }
        ];
    }

    private menuMenuItems(): MenuItemProps[] {
        return [
            { label: "Создать чат" },
            { label: "Открыть профиль", click: this.onClickProfile.bind(this) }
        ];
    }
    
}
