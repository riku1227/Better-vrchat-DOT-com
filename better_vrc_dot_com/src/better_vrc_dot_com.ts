import { BetterLocationCard } from "./features/better_location_card.js";

const intervalFunction = () => {
    if (window.location.href.indexOf("login") == -1) {
        BetterLocationCard.setupBetterLocationCard();
    }
}

setInterval(intervalFunction, 500);