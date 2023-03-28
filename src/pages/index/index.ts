import { AvatarData } from "../../api/AvatarAPI";
import ChatsController from "../../controllers/ChatsController";
import Popup from "../../layout/popup";
import routeUse, { PAGES } from "../../utils/route";
import { _Block } from "../../utils/_Block";
import { ErrorCallback } from "../../utils/_BlockWithForm";
import template from "./index.hbs";
import * as styles from './styles.module.pcss';

enum ATTACHES {
    Attache = "popupAttache",
    ChatMenu = "popupChatMenu",
    Menu = "popupMenu",
    AddUser = "dialogAddUser",
    RemoveUser = "dialogRemoveUser",
    FindChat = "findChatDialogBody",
    CreateChat = "createChatDialogBody",
    AvatarChat = "avatarChat",
    Users = "users",
    DeleteChat = "deleteChat"
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

            openPopupAttache: this.openPopup.bind(this, ATTACHES.Attache),
            openPopupChatMenu: this.openPopup.bind(this, ATTACHES.ChatMenu),
            openPopupMenu: this.openPopup.bind(this, ATTACHES.Menu),

            openFindChat: this.visibleChild .bind(this, true, ATTACHES.FindChat),
            openCreateChat: this.visibleChild.bind(this, true, ATTACHES.CreateChat),

            ecexuteAddUser: this.visibleChild.bind(this, false, ATTACHES.AddUser),
            ecexuteRemoveUser: this.visibleChild.bind(this, false, ATTACHES.RemoveUser),
            ecexuteFindChat: this.visibleChild.bind(this, false, ATTACHES.FindChat),
            executeCreateChat: this.visibleChild.bind(this, false, ATTACHES.CreateChat),
            ecexuteUpdataAvatar: this.ecexuteUpdataAvatar.bind(this),
            ecexuteDelChat: this.ecexuteDelChat.bind(this),

            ATTACHES
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
            { label: "Добавить пользователя", click: this.visibleChild.bind(this, true, ATTACHES.AddUser) },
            { label: "Удалить пользователя", click: this.visibleChild.bind(this, true, ATTACHES.RemoveUser) },
            { label: "Установить аватар", click: this.visibleChild.bind(this, true, ATTACHES.AvatarChat) },
            { label: "Удалить чат", click: this.visibleChild.bind(this, true, ATTACHES.DeleteChat) }
        ];
    }

    private menuMenuItems(): MenuItemTemplateProps[] {
        return [
            { label: "Создать чат", click: this.visibleChild.bind(this, true, ATTACHES.CreateChat) },
            { label: "Открыть профиль", click: this.go.bind(this, PAGES.Profile) }
        ];
    }
    
    async ecexuteDelChat(_values: any, errorCallback: ErrorCallback) {
        try {
            await ChatsController.deleteSelectedChat();
        }
        catch(exp) {
            // если удалить чат, который не создавал? reason	"Action is not permitted"
            errorCallback(String(exp)); //где показать???
            // делать модалку с вопросом???
            return;
        }
        this.visibleChild(false, ATTACHES.DeleteChat)
    }
    
    async ecexuteUpdataAvatar(values: AvatarData, errorCallback: ErrorCallback) {

        try {
            await ChatsController.avatar(values);
        }
        catch(exp) {
            errorCallback(String(exp));
            return;
        }

        this.visibleChild(false, ATTACHES.AvatarChat);

    }
}


