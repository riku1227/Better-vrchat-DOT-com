//@ts-check

class VRCLocationCard {
    /**
     * VRCLocationCardのコンストラクタ
     * "Join Friends"タブのカードを入れる
     * @param {Element} cardElement
     */
    constructor(cardElement) {
        /** @type {Element} */
        this.cardElement = cardElement;
    }

    /**
     * カードの上にある要素を取得する
     * ワールド / インスタンスの情報が表示される部分
     */
    get topElement() {
        return this.cardElement.children[0].children[0];
    }

    /**
     * カードの下に要素を取得する
     * そのインスタンスに居るフレンドが表示される部分
     */
    get bottomElement() {
        return this.cardElement.children[1];
    }

    /**
     * カードの右上にあるワールドの名前などのインスタンスの情報を表示している部分
     */
    get instanceInfoElement() {
        return this.topElement.children[1];
    }
    
    /**
     * ワールド名のa要素を取得する
     */
    get worldNameElement() {
        return this.instanceInfoElement.getElementsByTagName("a")[0];
    }

    /**
     * ワールド名を取得する
     */
    get worldName() {
        return this.worldNameElement.children[0].textContent;
    }

    /**
     * インスタンスのURLを取得する
     * 「https://vrchat.com/home/launch?worldId=${worldId}&instanceId=${instanceId}」
     */
    get instanceURL() {
        return this.worldNameElement.href;
    }

    /**
     * リージョン / フレンドの数 / "Invite Me"ボタン があるインスタンス情報一覧の親Divを取得する
     */
    get instanceInfoListElement() {
        return this.instanceInfoElement.children[2];
    }

    /**
     * インスタンスのリージョン情報の要素を取得する
     */
    get instanceRegionElement() {
        return this.instanceInfoListElement.children[0];
    }

    /**
     * インスタンスに居るフレンドの人数を表示する要素を取得する
     */
    get instanceFriendsCountElement() {
        return this.instanceInfoListElement.children[1];
    }

    /**
     * インスタンスに居るフレンドのリスト要素を取得する
     */
    get instanceFriendsListElement() {
        return this.bottomElement.getElementsByClassName("css-5kov97")[0];
    }

    /**
     * インスタンスに居るフレンドの人数を取得する
     */
    get instanceFriendsCount() {
        return this.instanceFriendsListElement.children.length;
    }
}