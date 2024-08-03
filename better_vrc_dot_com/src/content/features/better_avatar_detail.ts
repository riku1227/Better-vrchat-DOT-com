import { DOMUtil } from "../util/dom_util";
import { VRCAvatarDetailsPage } from "../vrchat/dom/page/vrc_avatar_details_page";

export class BetterAvatarDetail {
    // アバターの情報を表示するページを検知するための正規表現
    static urlRegex = new RegExp(/avatar\/avtr_[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);

    /**
     * アバターの情報を表示するページにあるアバターをパブリック化するボタンを非表示にする
     * 初期値はnullで、初回実行時にストレージからデータを取得してきて入れる
     */
    static enableHideMakeAvatarPublicButton: boolean | null = null;
    static enableHideMakeAvatarPublicButtonStorageKey = "enable_hide_make_avatar_public_button";

    /**
     * アバターを削除するボタンを非表示にする
     * 初期値はnullで、初回実行時にストレージからデータを取得してきて入れる
     */
    static enableHideDeleteAvatarButton: boolean | null = null;
    static enableHideDeleteAvatarButtonStorageKey = "enable_hide_delete_avatar_button";

    static async setupHideMakeAvatarPublicButton(detailsPage: VRCAvatarDetailsPage) {
        /**
         * enableHideMakeAvatarPublicButtonがnull(初期値)の時に
         * ストレージから設定値を取得する
         * 初回起動時のみストレージからデータを取得するようにするため
         */
        if(this.enableHideMakeAvatarPublicButton == null) {
            // ストレージから取得
            const result = await chrome.storage.sync.get(this.enableHideMakeAvatarPublicButtonStorageKey);

            // ストレージにそのキーが存在していたら
            if(this.enableHideMakeAvatarPublicButtonStorageKey in result) {
                this.enableHideMakeAvatarPublicButton = result[this.enableHideMakeAvatarPublicButtonStorageKey];
            } else {
                // していなかった場合は、設定の初期値を変数に入れ、ストレージに初期値を書き込む
                this.enableHideMakeAvatarPublicButton = false;
                chrome.storage.sync.set({ [this.enableHideMakeAvatarPublicButtonStorageKey]: this.enableHideMakeAvatarPublicButton });
            }
        }

        if(!this.enableHideMakeAvatarPublicButton) {
            return;
        }

        DOMUtil.hideElement(detailsPage.makeAvatarPublicButton);
    }

    static async setupHideDeleteAvatarButton(detailsPage: VRCAvatarDetailsPage) {
        /**
         * enableHideDeleteAvatarButtonがnull(初期値)の時に
         * ストレージから設定値を取得する
         * 初回起動時のみストレージからデータを取得するようにするため
         */
        if(this.enableHideDeleteAvatarButton == null) {
            // ストレージから取得
            const result = await chrome.storage.sync.get(this.enableHideDeleteAvatarButtonStorageKey);

            // ストレージにそのキーが存在していたら
            if(this.enableHideDeleteAvatarButtonStorageKey in result) {
                this.enableHideDeleteAvatarButton = result[this.enableHideDeleteAvatarButtonStorageKey];
            } else {
                // 存在していなかった場合は、設定の初期値を変数に入れ、ストレージに初期値を書き込む
                this.enableHideDeleteAvatarButton = false;
                chrome.storage.sync.set({ [this.enableHideDeleteAvatarButtonStorageKey]: this.enableHideDeleteAvatarButton });
            }
        }

        if(!this.enableHideDeleteAvatarButton) {
            return;
        }

        DOMUtil.hideElement(detailsPage.optionsButtonSpace);
        DOMUtil.hideElement(detailsPage.deleteAvatarButton);
    }

    static async setupBetterAvatarDetail(){
        // アバターの情報を表示するページじゃ無い場合はなにもしない
        if(!this.urlRegex.test(location.href)) {
            return;
        }

        const homeContent = document.getElementsByClassName("home-content")[0] as HTMLDivElement;
        const detailsPage = new VRCAvatarDetailsPage(homeContent);

        this.setupHideMakeAvatarPublicButton(detailsPage);
        this.setupHideDeleteAvatarButton(detailsPage);
    }
}