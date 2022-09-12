//@ts-check

class VRCDOM {
    /**
     * VRCのサイトで使用されているアイコンのSVGを生成する
     * VRCはFontAwesomeを使用
     * @param {String} title 
     * @param {String} pathCode <path>タグの中身を書く
     * @param {String} color
     */
    static createSVGIcon(title, pathCode, color, viewBox) {
        //親SVG要素を作る
        const iconSVG = document.createElementNS("http://www.w3.org/2000/svg","svg");
        //必要なクラスを追加
        DOM.addClassList(iconSVG, ["svg-inline--fa"]);
        //viewBoxを設定
        iconSVG.setAttribute("viewBox", viewBox);

        /**
         * そのSVGアイコンがなんたるかを語るタイトル要素
         * ナレーターとかが多分読むので大事 (拡張機能で追加した要素をちゃんと読むのかはわからない...)
         *  */ 
        const svgTitle = document.createElement("title");
        svgTitle.textContent = title;

        //SVGアイコンの中身であるPath要素を作成
        const svgPath = document.createElementNS("http://www.w3.org/2000/svg","path");
        svgPath.setAttribute("d", `${pathCode}`);
        svgPath.setAttribute("fill", color);

        //作った子要素を親SVGに追加する
        iconSVG.appendChild(svgTitle);
        iconSVG.appendChild(svgPath);

        return iconSVG;
    }

    /**
     * インスタンスの情報表示なので使用されるアイコン付きのバッジを生成する
     * @param {Element} svgIcon 
     * @param {String} content 
     */
    static createIconBadge(svgIcon, content) {
        const badgeDiv = document.createElement("div");
        DOM.addClassList(badgeDiv, ["align-self-end", "me-0", "me-sm-2", "align-items-center", "css-jm7yu6"]);
        badgeDiv.textContent = content;
        DOM.addClassList(svgIcon, ["ms-2"]);
        badgeDiv.appendChild(svgIcon);

        return badgeDiv;
    }

    /**
     * ボタンを生成する
     * @param {String} label 
     * @param {Function} onClick 
     */
    static createButton(label, onClick) {
        const button = document.createElement("button");
        //ボタンをボタンたらしめるクラスを追加
        DOM.addClassList(button, ["align-self-end", "css-21vcfd"]);
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
    static createIconButton(svgIcon, onClick) {
        const button = document.createElement("button");
        //ボタンをボタンたらしめるクラスを追加
        DOM.addClassList(button, ["align-self-end", "css-21vcfd"]);
        //中身のアイコンにマージンを追加
        DOM.addClassList(svgIcon, ["mx-1"]);
        //ボタンにアイコンを追加
        button.appendChild(svgIcon);
        //クリックイベントを設定
        button.addEventListener("click", (event) => { onClick(event) });

        return button;
    }
}