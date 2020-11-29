const intervalFunction = () => {
    if (window.location.href.indexOf("login") == -1) {
        BetterLocationCard.setupLocationCard();

        if(location.href.indexOf("home/avatars") != -1) {
            BetterAvatars.setupBetterAvatars();
        } else {
            clearInterval(IntervalIDS.avatarsInterval);
            IntervalIDS.avatarsInterval = 0;
        }
    }
}

window.addEventListener("load", () => {
    setInterval(intervalFunction, 3000);
}, false);