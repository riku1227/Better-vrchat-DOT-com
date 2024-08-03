import { BetterAvatarDetail } from "./features/better_avatar_detail.js";
import { BetterLocationCard } from "./features/better_location_card.js";
import { ExtensionNavigation } from "./features/extension_navigation.js";

const intervalFunction = () => {
    if (window.location.href.indexOf("login") == -1) {
        ExtensionNavigation.setupNavigation();
        BetterLocationCard.setupBetterLocationCard();
        BetterAvatarDetail.setupBetterAvatarDetail();
    }
}

setInterval(intervalFunction, 500);