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

    static async setupHideMakeAvatarPublicButton() {
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

        const homeContent = document.getElementsByClassName("home-content")[0] as HTMLDivElement;
        const detailsPage = new VRCAvatarDetailsPage(homeContent);
        detailsPage.makeAvatarPublicButton?.remove();
    }

    static async setupBetterAvatarDetail(){
        // アバターの情報を表示するページじゃ無い場合はなにもしない
        if(!this.urlRegex.test(location.href)) {
            return;
        }

        this.setupHideMakeAvatarPublicButton();
    }
}