import { BetterAvatarDetail } from "./features/better_avatar_detail.js";
import { BetterLocationCard } from "./features/better_location_card.js";

const intervalFunction = () => {
    if (window.location.href.indexOf("login") == -1) {
        BetterLocationCard.setupBetterLocationCard();
        BetterAvatarDetail.setupBetterAvatarDetail();
    }
}

setInterval(intervalFunction, 500);