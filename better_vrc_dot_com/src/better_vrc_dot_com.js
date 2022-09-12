//定期的に実行させる奴
const intervalFunction = () => {
    if (window.location.href.indexOf("login") == -1) {
        BetterLocationCard.setupBetterLocationCard();
        /* if(location.href.indexOf("home/avatars") != -1) {
            BetterAvatars.setupBetterAvatars();
        } else {
            clearInterval(IntervalIDS.avatarsInterval);
            IntervalIDS.avatarsInterval = 0;
        } */
    }
}

setInterval(intervalFunction, 500);