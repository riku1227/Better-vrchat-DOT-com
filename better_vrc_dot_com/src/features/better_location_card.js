//@ts-check

class BetterLocationCard {
    //"Join Friends"タブのロケーションカードリストの親Divのクラス名
    static locationsDivClassName = "locations";

    static friendsCountPClass = "better_vrc_dot_com_location_friends_count_p";
    static instanceUserCountBadgeClass = "better_vrc_dot_com_instance_user_count_badge";

    static fasHouseUserPath = "M576 287.6H511.8l1 224.4H64.1V287.6H0V240L288.4 0 576 240v47.6zM352 224c0-35.3-28.7-64-64-64s-64 28.7-64 64s28.7 64 64 64s64-28.7 64-64zm48 192l-32-96H208l-32 96H400z";
    static fasHouseUserViewBox = "0 0 576 512";

    static instanceUserBadgeRegex = /([0-9]|[1-9][0-9]|[1-9][0-9][0-9]|[1-9][0-9][0-9][0-9]|Click)<svg/g;

    /**
     * ロケーションカードにインスタンス人数を表示するバッジが存在するかどうか
     * @param {VRCLocationCard} locationCard 
     */
    static existsInstanceUserCountBadge(locationCard) {
        const htmlCollection = locationCard.instanceInfoListElement.getElementsByClassName(this.instanceUserCountBadgeClass);
        return htmlCollection.length > 0;
    }

    /**
     * インスタンスの情報を取得する
     * @param {VRCLocationCard} locationCard 
     * @return Promise
     */
    static getInstanceWorld(locationCard) {
        const instanceWorldURL = locationCard.instanceURL;
        const worldId = VRCUtil.getWorldIDFromURL(instanceWorldURL);
        const instanceId = VRCUtil.getInstanceIDFromURL(instanceWorldURL);

        return VRChatAPI.getWorldInstanceByID(worldId, instanceId);
    }

    /**
     * インスタンスに居るユーザー数を表示するバッジを追加する
     * @param {VRCLocationCard} locationCard 
     */
    static addInstanceUserCountBadge(locationCard) {
        if(!this.existsInstanceUserCountBadge(locationCard)) {
            const instanceUserIcon = VRCDOM.createSVGIcon("Number of users in the Instance", this.fasHouseUserPath, "#8f8f8d", this.fasHouseUserViewBox);
            const instanceUserCountBadge = VRCDOM.createIconBadge(instanceUserIcon, "Click");
            DOM.addClassList(instanceUserCountBadge, [ this.instanceUserCountBadgeClass ]);

            //Invite Meボタンの左にバッジを設置する
            locationCard.instanceInfoListElement.insertBefore(
                instanceUserCountBadge,
                locationCard.instanceInfoListElement.lastChild
            );

            instanceUserCountBadge.addEventListener("click", () => {
                this.updateInstanceUserCountBadge(locationCard);
            });
        }
    }

    /**
     * 
     * @param {VRCLocationCard} locationCard 
     */
    static updateInstanceUserCountBadge(locationCard) {
        if(this.existsInstanceUserCountBadge(locationCard)) {
            this.getInstanceWorld(locationCard).then((request) => {
                const result = JSON.parse(request.response);

                const instanceUserCountBadge = locationCard.instanceInfoListElement.getElementsByClassName(this.instanceUserCountBadgeClass)[0];
                console.log(instanceUserCountBadge.innerHTML);
                instanceUserCountBadge.innerHTML = instanceUserCountBadge.innerHTML.replace(this.instanceUserBadgeRegex, result.n_users + "<svg");
                console.log(result);
            });
        }
    }

    /**
     * ベターロケーションカードのセットアップを行う
     * ベターロケーションカードを使うにはこの処理を実行するればいい
     */
    static setupBetterLocationCard() {
        //ロケーションカードをすべて取得する
        const locationCards = DOM.getByClass(this.locationsDivClassName)[0].children;
        //forで回す
        for(let i = 0; i < locationCards.length; i++) {
            //ロケーションカードインスタンスを作成
            const locationCard = new VRCLocationCard(locationCards[i]);
            //インスタンスに居るユーザー数バッジを追加する
            this.addInstanceUserCountBadge(locationCard);
        }
    }
}