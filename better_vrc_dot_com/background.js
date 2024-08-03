// Content Scriptなどからメッセージを受け取ったら発火するイベント
chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
        // 文字列でメッセージを送っている
        switch (request) {
            // 拡張機能の設定ページを開く
            case "better_vrchat_dot_com_open_settings":
                chrome.tabs.create({
                    url: "options/options.html",
                    active: true
                });
                break;
        }
    }
)