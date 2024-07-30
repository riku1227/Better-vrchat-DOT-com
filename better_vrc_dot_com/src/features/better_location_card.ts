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
    static updateCoolTime = 10;

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

            updateButton.title = "インスタンスに居るユーザー数を更新します / Update number of users in the Instance";

            // 元からロケーションカードの中にあるインスタンスに居るユーザー数を表示するバッジ
            /**
             * インスタンスのユーザー数を表示するバッジだけ要素が追加されるまで少しラグがあるっぽいので
             * 子要素の配列から子要素の数を使用した相対的な取得をするとずれる場合が多々発生した
             * 
             * そのため、直接指定したいが、title要素くらいしかそのバッジを取得できる子要素が無いが
             * title要素から取得しようとした場合、このサイトが多言語に対応したときにバグってしまうので
             * あんまり変更されることが無いであろう(適当)のバッジに使用されているアイコンのクラス名から子要素を取得し、その親要素を取得することでユーザー数バッジを取得する
             */
            const numberOfUsersBadgeList = locationCard.instanceInfoListElement.getElementsByClassName("fa-users");

            if (numberOfUsersBadgeList.length > 0) {
                const numberOfUsersBadge = numberOfUsersBadgeList[0].parentElement;

                if (numberOfUsersBadge) {
                    // 拡張機能で操作しやすくするためにクラスを付与しておく
                    DOMUtil.addClassList(numberOfUsersBadge, [this.classInstanceUserCountBadge]);

                    //Invite Meボタンの左にバッジを設置する
                    locationCard.instanceInfoListElement.insertBefore(
                        updateButton,
                        numberOfUsersBadge.nextSibling
                    );
                }
            }
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

            // ユーザー数を表示するバッジを取得する
            const instanceUserCountBadge = locationCard.instanceInfoListElement.getElementsByClassName(this.classInstanceUserCountBadge)[0];

            /**
             * 取得してきたデータを使った更新するテキスト
             * 一緒にキャパシティとか取ってこれるのでついでに使う
             */
            const newUserCountText = `${result.n_users}/${result.capacity}`;

            // バッジ内のテキストのみ上書きできるようにfirstChildで取得できる要素を更新する
            const userCountTextNode = instanceUserCountBadge.firstChild;
            if (userCountTextNode) {
                userCountTextNode.textContent = `${newUserCountText}`;
            }
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
        if (BetterLocationCard.enableInstanceUserCount == null) {
            // ストレージに収納している設定値のキー
            const betterLocationCardStorageKey = "enable_location_card_instance_user_count";
            const result = await chrome.storage.sync.get(betterLocationCardStorageKey);

            if (betterLocationCardStorageKey in result) {
                BetterLocationCard.enableInstanceUserCount = result[betterLocationCardStorageKey];
            } else {
                BetterLocationCard.enableInstanceUserCount = true;
            }
        }

        // 設定で無効化されていたら何もせず処理を終了する
        if (!BetterLocationCard.enableInstanceUserCount) {
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
            this.addInstanceUserCountUpdateButton(locationCard);
        }
    }
}