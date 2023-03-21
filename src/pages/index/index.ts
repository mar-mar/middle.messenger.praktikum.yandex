import { CreateChatData } from "../../api/ChatsAPI";
import { SearchUserData } from "../../api/UsersAPI";
import ChatsController from "../../controllers/ChatsController";
import Popup from "../../layout/popup";
import routeUse, { PAGES } from "../../utils/route";
import { _Block } from "../../utils/_Block";
import { ErrorCallback } from "../../utils/_BlockWithForm";
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

//{ item: { chats?: ChatInfo[] }}
export default class IndexPage extends _Block {

    protected getCompileOptions() {
        return { 
            template, 
            styles,           

            //attachMenuItems: this.attachMenuItems(),
            chatMenuMenuItems: this.chatMenuMenuItems(),
            menuMenuItems: this.menuMenuItems(),

            openPopupAttache: this.openPopup.bind(this, CHILD_NAMES.Attache),
            openPopupChatMenu: this.openPopup.bind(this, CHILD_NAMES.ChatMenu),
            openPopupMenu: this.openPopup.bind(this, CHILD_NAMES.Menu),

            openFindChat: this.visibleChild .bind(this, true, CHILD_NAMES.FindChat),
            openCreateChat: this.visibleChild.bind(this, true, CHILD_NAMES.CreateChat),

            ecexuteAddUser: this.ecexuteAddUser.bind(this),
            ecexuteRemoveUser: this.ecexuteRemoveUser.bind(this),
            ecexuteFindChat: this.visibleChild.bind(this, false, CHILD_NAMES.FindChat),
            executeCreateChat: this.executeCreateChat.bind(this),
            ecexuteUpdataAvatar: this.ecexuteUpdataAvatar.bind(this),

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

    /*private attachMenuItems(): MenuItemTemplateProps[] {
        return [
            { label: "Фото или Видео"},
            { label: "Файл" },
            { label: "Локация" }
        ];
    }*/

    private chatMenuMenuItems(): MenuItemTemplateProps[] {
        return [
            { label: "Добавить пользователя", click: this.visibleChild.bind(this, true, CHILD_NAMES.AddUser) },
            { label: "Удалить пользователя", click: this.visibleChild.bind(this, true, CHILD_NAMES.RemoveUser) },
            { label: "Удалить чат", click: this.ecexuteDelChat.bind(this) }
        ];
    }

    private menuMenuItems(): MenuItemTemplateProps[] {
        return [
            { label: "Создать чат", click: this.visibleChild.bind(this, true, CHILD_NAMES.CreateChat) },
            { label: "Открыть профиль", click: this.go.bind(this, PAGES.Profile) }
        ];
    }
    
    async executeCreateChat(values: CreateChatData, errorCallback: ErrorCallback) {

        try {
            await ChatsController.create(values);
        }
        catch(exp) {
            errorCallback(String(exp));
            return;
        }

        this.visibleChild(false, CHILD_NAMES.CreateChat);
    }


    async ecexuteDelChat() {
        try {
            await ChatsController.deleteSelectedChat();
        }
        catch(exp) {
            //errorCallback(String(exp)); где показать???
            // делать модулку с вопросом???
            return;
        }
    }

    async ecexuteAddUser(values: SearchUserData, errorCallback: ErrorCallback) {
        try {
            await ChatsController.addUserToSelectedChat(values);
        }
        catch(exp) {
            errorCallback(String(exp));
            return;
        }

        this.visibleChild(false, CHILD_NAMES.AddUser);
    }

    async ecexuteRemoveUser(values: SearchUserData, errorCallback: ErrorCallback) {
        try {
            await ChatsController.removeUserFromSelectedChat(values);
        }
        catch(exp) {
            errorCallback(String(exp));
            return;
        }

        this.visibleChild(false, CHILD_NAMES.RemoveUser);
    }
    
    async ecexuteUpdataAvatar() {}
}


