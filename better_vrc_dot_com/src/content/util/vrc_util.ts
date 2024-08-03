//コメントはAIが生成

import { Util } from "./util.js";

export class VRCUtil {
    /**
     * URLからワールドIDを取得します。
     * @param url 対象のURL
     * @returns ワールドID
     */
    static getWorldIDFromURL(url: string): string | undefined {
        // URLからクエリパラメータを取得し、"worldId"があればその値を返します。
        return Util.getQueriesFromStr(url)["worldId"];
    }

    /**
     * URLからインスタンスIDを取得します。
     * @param url 対象のURL
     * @returns インスタンスID
     */
    static getInstanceIDFromURL(url: string): string | undefined {
        // URLからクエリパラメータを取得し、"instanceId"があればその値を返します。
        return Util.getQueriesFromStr(url)["instanceId"];
    }

    /**
     * URLから"vrchat.com"を除いた文字列を返します。
     * @param url 対象のURL
     * @returns "vrchat.com"を除いた文字列
     */
    static removeVRChatDotComURL(url: string): string {
        // URLから"https://www.vrchat.com/"または"https://vrchat.com/"および"home/"を除去します。
        return url.replace("https://www.vrchat.com/", "").replace("https://vrchat.com/", "").replace("home/", "");
    }
}