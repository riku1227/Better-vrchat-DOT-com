/**
 * PCだと左側に表示されるナビゲーションエリアを良い感じに扱えるようにするクラス
 */
export class VRCNavigation {
    static instance: VRCNavigation;

    navigationDiv: HTMLDivElement;

    /**
     * シングルトン的な？
     * ナビゲーションは1個しか無いからこっちの方がわかりやすいかなぁという感じ
     */
    static get get(): VRCNavigation {
        if(this.instance == null) {
            this.instance = new VRCNavigation(document.getElementsByTagName("nav")[0]);
        }

        return this.instance;
    }

    constructor(navigation: Element) {
        /**
         * navの中に入っているdivの中に子要素が入っているので
         * 扱いやすいようにdivの方を使う
         */
        this.navigationDiv = navigation.children[0] as HTMLDivElement;
    }

    
    /**
     * ナビゲーションにボタンを追加する
     * 既にその要素(IDで判定)が存在していた場合は、なにもしない
     * @param navigationButton 追加するボタン
     * @returns 
     */
    addNavigationButton(navigationButton: HTMLAnchorElement) {
        //既にその要素が存在していたら何もしない
        if(document.getElementById(navigationButton.id) != null) {
            return ;
        }

        this.navigationDiv.appendChild(navigationButton);
    }
}