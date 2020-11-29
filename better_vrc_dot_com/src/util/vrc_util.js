class VRCUtil {
    static getWorldIDFromURL(url) {
        return Util.getQueriesFromStr(url)["worldId"];
    }

    static getInstanceIDFromURL(url) {
        return Util.getQueriesFromStr(url)["instanceId"];
    }

    static removeVRChatDotComURL(url) {
        return url.replace("https://www.vrchat.com/", "").replace("https://vrchat.com/", "").replace("home/", "");
    }
}