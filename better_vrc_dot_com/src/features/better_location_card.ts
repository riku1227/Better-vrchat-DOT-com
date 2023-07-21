import { VRCLocationCard } from "../vrchat/dom/vrc_location_card.js";
import { DOMUtil } from "../util/dom_util.js";
import { VRCDOM } from "../vrchat/dom/vrc_dom.js";
import { VRCUtil } from "../util/vrc_util.js";
import { VRChatAPI } from "../vrchat/vrchat_api.js";
import { FAS } from "../font_awesome.js";

export class BetterLocationCard {
    /**
     * インスタンスに居るユーザーの人数表示機能が有効化されているかどうか
     * 初期値はnullで、初回実行時にストレージからデータを取得してきて入れる
     */
    static enableInstanceUserCount: boolean | null = null;

    //リロードボタンを連続でクリックし、VRC側に負荷がかかりすぎない用のクールタイム
    static updateCoolTime = 0;

    //"Join Friends"タブのロケーションカードリストの親Divのクラス名
    static locationsDivClassName = "locations";

    static classInstanceUserCountBadge = "better_vrc_dot_com_instance_user_count_badge";
    static classInstanceUserCountUpdateButton = "better_vrc_dot_com_instance_user_count_update_button";

    /**
     * VRCLocationCardでインスタンスの情報を取得する
     * @param locationCard 対象のカード 
     */
    static async getInstanceWorld(locationCard: VRCLocationCard): Promise<XMLHttpRequest> {
        const instanceWorldURL = locationCard.instanceURL;
        const worldId = VRCUtil.getWorldIDFromURL(instanceWorldURL);
        const instanceId = VRCUtil.getInstanceIDFromURL(instanceWorldURL);

        return await VRChatAPI.getWorldInstanceByID(worldId!, instanceId!);
    }


    /**
     * そのカードにインスタンスのユーザー数を表示するバッジが存在しているかどうか
     * @param locationCard 対象のカード
     * @returns 存在してたらtrue
     */
    static existsInstanceUserCountBadge(locationCard: VRCLocationCard): boolean {
        const htmlCollection = locationCard.instanceInfoListElement.getElementsByClassName(this.classInstanceUserCountBadge);
        return htmlCollection.length > 0;
    }

    /**
     * ロケーションカードにインスタンス人数を更新するボタンが存在するかどうか
     * @param locationCard 対象のカード
     * @returns 存在したらtrue
     */
    static existsInstanceUserCountUpdateButton(locationCard: VRCLocationCard): boolean {
        const htmlCollection = locationCard.instanceInfoListElement.getElementsByClassName(this.classInstanceUserCountUpdateButton);
        return htmlCollection.length > 0;
    }

    /**
     * インスタンスのユーザー数を表示するバッジを生成する
     * @param content コンテンツ
     * @returns 
     */
    static createInstanceUserBadge(content: string) {
        //アイコンのSVG要素を生成
        const instanceUserIcon = VRCDOM.createSVGIcon("Number of users in the Instance", FAS.houseUser.path, "#8f8f8d", FAS.houseUser.viewBox);
        //バッジを生成
        const instanceUserCountBadge = VRCDOM.createIconBadge(instanceUserIcon, content);
        //必要なクラスを追加
        DOMUtil.addClassList(instanceUserCountBadge, [this.classInstanceUserCountBadge]);

        return instanceUserCountBadge;
    }

    /**
     * インスタンスに居るユーザ数を更新するボタンを追加する
     * @param locationCard 対象のカード
     */
    static addInstanceUserCountUpdateButton(locationCard: VRCLocationCard) {
        //既に更新ボタンが追加されていたら実行しない
        if (!this.existsInstanceUserCountUpdateButton(locationCard)) {
            //更新ボタンをアイコン
            const rotateRightIconSVG = VRCDOM.createSVGIcon("Update number of users in the Instance", FAS.rotateRight.path, "#FFFFFF", FAS.rotateRight.viewBox);
            //更新ボタン
            const updateButton = VRCDOM.createIconButton(rotateRightIconSVG, async (e) => {
                //前回の更新から10秒以上経過していたら (500msに一回カウントが追加される)
                if (this.updateCoolTime >= 10) {
                    await this.updateInstanceUserCountBadge(locationCard);
                    this.updateCoolTime = 0;
                }
            });
            DOMUtil.addClassList(updateButton, ["me-sm-2", "flex-grow-0", this.classInstanceUserCountUpdateButton]);

            //Invite Meボタンの左にバッジを設置する
            locationCard.instanceInfoListElement.insertBefore(
                updateButton,
                locationCard.instanceInfoListElement.lastChild
            );
        }
    }

    /**
     * ユーザー数を表示するバッジを更新(再生成して置き換え)する
     * @param locationCard 対象のカード
     */
    static async updateInstanceUserCountBadge(locationCard: VRCLocationCard): Promise<void> {
        if (this.existsInstanceUserCountBadge(locationCard)) {
            const request = await this.getInstanceWorld(locationCard);
            const result = JSON.parse(request.response);

            const instanceUserCountBadge = locationCard.instanceInfoListElement.getElementsByClassName(this.classInstanceUserCountBadge)[0];
            //instanceUserCountBadge.textContent = instanceUserCountBadge.innerHTML.replace(this.instanceUserBadgeRegex, result.n_users + "<svg");

            /**
             * innerHtml使ったらFirefoxに怒られたから使わないために新しくバッジを作って入れ替える
             */

            const newInstanceUserCountBadge = this.createInstanceUserBadge(result.n_users);
            instanceUserCountBadge.replaceWith(newInstanceUserCountBadge);
        }
    }

    static addInstanceUserCountBadge(locationCard: VRCLocationCard) {
        if (!this.existsInstanceUserCountBadge(locationCard)) {
            const instanceUserCountBadge = this.createInstanceUserBadge("Click");

            //Invite Meボタンの左にバッジを設置する
            locationCard.instanceInfoListElement.insertBefore(
                instanceUserCountBadge,
                locationCard.instanceInfoListElement.lastChild
            );

            //バッジが"Click"状態の時にクリックしたら実行される
            const firstUpdate = async () => {
                //人数を表示 (取得)
                await this.updateInstanceUserCountBadge(locationCard);
                //更新ボタンを追加
                this.addInstanceUserCountUpdateButton(locationCard);
                //以降バッジをクリックしてもこれが実行されないように削除する
                instanceUserCountBadge.removeEventListener("click", firstUpdate);
            }
            instanceUserCountBadge.addEventListener("click", firstUpdate);
        }
    }

    /**
     * 情報を追加するために必要なレイアウトにするためにクラスを追加する
     * @param locationCard 対象のロケーションカード
     */
    static setupInstanceInfoLayout(locationCard: VRCLocationCard) {
        DOMUtil.addClassList(locationCard.instanceInfoListElement, ["flex-wrap", "align-content-end"]);
        if (locationCard.inviteMEButton) {
            DOMUtil.addClassList(locationCard.inviteMEButton, ["mt-2"]);
        }
    }

    /**
     * BetterLocationCardのセットアップをする
     * BetterLocationCardを使うにはこの処理を実行するればいい
     */
    static async setupBetterLocationCard() {
        /**
         * BetterLocationCard.enableInstanceUserCountがnull(初期値)の時に
         * ストレージから設定値を取得する
         * 初回起動時のみストレージからデータを取得するようにするためにこうしている
         */
        if(BetterLocationCard.enableInstanceUserCount == null) {
            // ストレージに収納している設定値のキー
            const betterLocationCardStorageKey = "enable_location_card_instance_user_count";
            const result = await chrome.storage.sync.get(betterLocationCardStorageKey);

            if(betterLocationCardStorageKey in result) {
                BetterLocationCard.enableInstanceUserCount = result[betterLocationCardStorageKey];
            } else {
                BetterLocationCard.enableInstanceUserCount = true;
            }
        }

        // 設定で無効化されていたら何もせず処理を終了する
        if(!BetterLocationCard.enableInstanceUserCount) {
            return;
        }

        this.updateCoolTime++;

        //ロケーションカードが入っているdivを取得する
        const locationCardsDiv = document.getElementsByClassName(this.locationsDivClassName);

        //ロケーションカードが入っているdivが存在しなかったら、何もせず処理を終了する
        if (locationCardsDiv.length == 0) {
            return;
        }

        //ロケーションカードを全て取得する
        const locationCardList = locationCardsDiv[0].children;


        for (let i = 0; i < locationCardList.length; i++) {
            const locationCard = new VRCLocationCard(locationCardList[i]);
            this.setupInstanceInfoLayout(locationCard);
            this.addInstanceUserCountBadge(locationCard);
        }
    }
}