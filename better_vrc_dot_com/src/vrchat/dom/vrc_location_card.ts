/**
 * vrchat.com/home のインスタンスの情報を表示するカードを扱いやすくするクラス
 */
export class VRCLocationCard {
    card: Element;

    constructor(card: Element) {
        this.card = card;
    }

    /**
     * カードの上にある要素を取得する
     * ワールド / インスタンスの情報が表示される部分
     */
    get topElement(): Element {
        return this.card.children[0].children[0];
    }

    /**
     * カードの下に要素を取得する
     * そのインスタンスに居るフレンドが表示される部分
     */
    get bottomElement(): Element {
        return this.card.children[1];
    }

    /**
     * カードの右上にあるワールドの名前などのインスタンスの情報を表示している部分
     */
    get instanceInfoElement(): Element {
        return this.topElement.children[1];
    }

    /**
     * ワールド名のa要素を取得する
     */
    get worldNameElement(): HTMLAnchorElement {
        return this.instanceInfoElement.getElementsByTagName("a")[0];
    }

    /**
     * ワールド名を取得する
     */
    get worldName(): string | null {
        return this.worldNameElement.children[0].textContent;
    }

    /**
     * インスタンスのURLを取得する
     * 「https://vrchat.com/home/launch?worldId=${worldId}&instanceId=${instanceId}」
     */
    get instanceURL(): string {
        return this.worldNameElement.href;
    }

    /**
     * リージョン / フレンドの数 / "Invite Me"ボタン があるインスタンス情報一覧の親Divを取得する
     */
    get instanceInfoListElement(): Element {
        return this.instanceInfoElement.children[2];
    }

    /**
     * インスタンスのリージョン情報の要素を取得する
     */
    get instanceRegionElement(): Element {
        return this.instanceInfoListElement.children[0];
    }

    /**
     * インスタンスに居るフレンドの人数を表示する要素を取得する
     */
    get instanceFriendsCountElement(): Element {
        return this.instanceInfoListElement.children[1];
    }

    /**
     * インスタンスに居るフレンドのリスト要素を取得する
     */
    get instanceFriendsListElement(): Element {
        return this.bottomElement.getElementsByClassName("css-5kov97")[0];
    }

    /**
     * インスタンスに居るフレンドの人数を取得する
     */
    get instanceFriendsCount(): number {
        return this.instanceFriendsListElement.children.length;
    }

    /**
     * Invite MEボタンを取得する
     */
    get inviteMEButton(): Element | null {
        return this.card.querySelector(`[aria-label="Invite Me"]`);
    }
}