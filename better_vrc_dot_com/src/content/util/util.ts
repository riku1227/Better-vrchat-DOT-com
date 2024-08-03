// めんどくさいのでAIにコメントを生成させた
export class Util {
    /**
     * 引数に与えられたURL文字列から、クエリパラメータを取得し、{ [key: string]: string } の形式で返します。
     * @param urlStr 対象のURL文字列
     * @returns クエリパラメータを格納したオブジェクト
     */
    static getQueriesFromStr(urlStr: string): { [key: string]: string } {
        // クエリパラメータを格納する連想配列
        const queryMap: { [key: string]: string } = {};
        // URLにクエリパラメータが含まれているかチェック
        if (urlStr.indexOf("?") == -1) {
            return queryMap;
        }

        // クエリパラメータを & で分割し、= でキーと値を分けて queryMap に格納する
        const urlSplit = urlStr.split("?")[1].split("&");
        for (let i = 0; i < urlSplit.length; i++) {
            if (urlSplit[i].indexOf("=") != -1) {
                const valueKey = urlSplit[i].split("=");
                queryMap[valueKey[0]] = valueKey[1];
            }
        }

        return queryMap;
    }

    /**
     * 現在時刻をログ形式で返します。
     * @returns 現在時刻のログ形式
     */
    static getTimeOnLogFormat(): string {
        // 現在時刻を取得
        const nowDate = new Date();
        // ログ形式に整形して返す
        return `[${nowDate.getHours()}:${nowDate.getMinutes()}:${nowDate.getSeconds()}]`;
    }

    /**
     * 引数に与えられたファイルをテキスト形式で読み込みます。
     * @param file 対象のファイル
     * @returns ファイルの内容をテキスト形式で返します。
     */
    static readFileAsText(file: Blob): Promise<string> {
        return new Promise((callback) => {
            // ファイルリーダーオブジェクトを生成
            const fileReader = new FileReader();
            // ファイルをテキスト形式で読み込む
            fileReader.readAsText(file);
            // 読み込み完了時にコールバック関数を実行
            fileReader.onload = function () {
                callback(fileReader.result as string);
            }
        });
    }
}