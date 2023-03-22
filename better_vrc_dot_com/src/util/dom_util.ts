/**
 * DOM操作に便利な関数を詰め込んだクラス
 */
export class DOMUtil {
    /**
     * 指定した要素にクラスを全て追加する
     * @param element クラスを追加する要素
     * @param classList 追加するクラスの文字列配列
     */
    static addClassList(element: Element, classList: string[]) {
        for (let i = 0; i < classList.length; i++) {
            element.classList.add(classList[i]);
        }
    }
}