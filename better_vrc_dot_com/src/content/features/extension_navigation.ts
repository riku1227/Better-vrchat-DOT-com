import { VRCDOM } from "../vrchat/dom/vrc_dom";
import { VRCNavigation } from "../vrchat/dom/vrc_navigation";

/**
 * デスクトップだと左側に表示されるナビゲーションメニューを弄る
 */
export class ExtensionNavigation {
    static setupNavigation() {
        // ナビゲーションに表示するアイコンの作成
        const navigationIcon = document.createElement("img");
        navigationIcon.src = chrome.runtime.getURL("images/extension_icon.png");
        navigationIcon.height = 24;

        // ナビゲーションメニューに追加
        VRCNavigation.get.addNavigationButton(
            VRCDOM.createNavigationButton(
                {
                    icon: navigationIcon,
                    label: chrome.i18n.getMessage("navigation_open_extension_settings"),
                    id: "better_vrchat_dot_com_open_settings_navigation",
                    onClick: () => {
                        chrome.runtime.sendMessage("better_vrchat_dot_com_open_settings");
                    }
                }
            )
        );
    }
}