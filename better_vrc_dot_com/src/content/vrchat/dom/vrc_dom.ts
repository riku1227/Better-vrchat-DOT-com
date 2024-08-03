import { FAS } from "../../font_awesome.js";
import { DOMUtil } from "../../util/dom_util.js";

export class VRCDOM {
    /**
     * VRCのサイトで使用されているアイコンのSVGを生成する
     * VRCはFontAwesomeを使用
     * @param title ホバーしたときに表示されるアイコンの説明 (読み上げにも使われる)
     * @param pathCode SVGのパス
     * @param color アイコンの色
     * @param viewBox SVGのviewbox
     * @returns 生成された要素
     */
    static createSVGIcon(title: string, pathCode: string, color: string, viewBox: string): SVGSVGElement {
        //親SVG要素を作る
        const iconSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        //必要なクラスを追加
        DOMUtil.addClassList(iconSVG, ["svg-inline--fa"]);
        //viewBoxを設定
        iconSVG.setAttribute("viewBox", viewBox);

        /**
         * そのSVGアイコンがなんたるかを語るタイトル要素
         * ナレーターとかが多分読むので大事 (拡張機能で追加した要素をちゃんと読むのかはわからない...)
         *  */
        const svgTitle = document.createElement("title");
        svgTitle.textContent = title;

        //SVGアイコンの中身であるPath要素を作成
        const svgPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
        svgPath.setAttribute("d", `${pathCode}`);
        svgPath.setAttribute("fill", color);

        //作った子要素を親SVGに追加する
        iconSVG.appendChild(svgTitle);
        iconSVG.appendChild(svgPath);

        return iconSVG;
    }

    /**
     * インスタンスの情報表示なので使用されるアイコン付きのバッジを生成する
     * @param svgIcon SVGのアイコン要素
     * @param content 表示する文字列
     * @returns 生成された要素
     */
    static createIconBadge(svgIcon: SVGSVGElement, content: string): HTMLDivElement {
        const badgeDiv = document.createElement("div");
        DOMUtil.addClassList(badgeDiv, ["align-self-end", "me-0", "me-sm-2", "align-items-center", "css-jm7yu6"]);
        badgeDiv.textContent = content;
        DOMUtil.addClassList(svgIcon, ["ms-2"]);
        badgeDiv.appendChild(svgIcon);

        return badgeDiv;
    }

    /**
     * ボタンを生成する
     * @param label ボタンのラベル
     * @param onClick コールバック
     * @returns 生成された要素
     */
    static createButton(label: string, onClick: (event: MouseEvent) => void): HTMLButtonElement {
        const button = document.createElement("button");
        //ボタンをボタンたらしめるクラスを追加
        DOMUtil.addClassList(button, ["align-self-end", "css-17kndqb"]);
        //ボタンのテキストを設定
        button.textContent = label;
        //クリックイベントを設定
        button.addEventListener("click", (event) => { onClick(event) });

        return button;
    }

    /**
     * アイコンボタンを生成する
     * @param {Element} svgIcon 
     * @param {Function} onClick 
     * @returns 
     */
    static createIconButton(svgIcon: SVGSVGElement, onClick: (event: MouseEvent) => void): HTMLButtonElement {
        const button = document.createElement("button");
        //ボタンをボタンたらしめるクラスを追加
        DOMUtil.addClassList(button, ["align-self-end", "me-0", "me-sm-2", "align-items-center", "css-jm7yu6"]);
        //ボタンが横幅いっぱいに拡大されないようにする
        button.style.flex = "none !important";
        button.style.border = "none";
        //中身のアイコンにマージンを追加
        DOMUtil.addClassList(svgIcon, ["m-1"]);

        //ボタンにアイコンを追加
        button.appendChild(svgIcon);
        //クリックイベントを設定
        button.addEventListener("click", (event) => { onClick(event) });

        return button;
    }

    /**
     * PCだと左に、モバイルだとナビゲーションドロワーの中にあるナビゲーションボタンを生成する
     * @param label 
     * @param onClick 
     */
    static createNavigationButton(argObj: {
        label: string,
        id: string,
        icon?: Element,
        onClick: (event: MouseEvent) => void
    }): HTMLAnchorElement {
        const navigationButton = document.createElement("a");
        DOMUtil.addClassList(navigationButton, ["btn", "css-yjay0l"]);
        navigationButton.id = argObj.id;

        if (argObj.icon) {
            navigationButton.appendChild(argObj.icon);
        }

        const buttonLabel = document.createElement("div");
        buttonLabel.textContent = argObj.label;
        navigationButton.appendChild(buttonLabel);

        const arrowIcon = VRCDOM.createSVGIcon("Arrow", FAS.angleRight.path, "currentColor", FAS.angleRight.viewBox);
        navigationButton.appendChild(arrowIcon);

        navigationButton.addEventListener("click", (event) => { argObj.onClick(event) });

        return navigationButton;
    }
}