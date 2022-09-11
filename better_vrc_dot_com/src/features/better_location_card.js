//@ts-check

class BetterLocationCard {
    //"Join Friends"タブのロケーションカードリストの親Divのクラス名
    static locationsDivClassName = "locations";

    static friendsCountPClass = "better_vrc_dot_com_location_friends_count_p";
    static instanceUserCountBadgeClass = "better_vrc_dot_com_instance_user_count_badge";
    static instanceUserCountUpdateButtonClass = "better_vrc_dot_com_instance_user_count_update_button";

    //Font Awesome Pro 6.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc.
    static fasHouseUserPath = "M576 287.6H511.8l1 224.4H64.1V287.6H0V240L288.4 0 576 240v47.6zM352 224c0-35.3-28.7-64-64-64s-64 28.7-64 64s28.7 64 64 64s64-28.7 64-64zm48 192l-32-96H208l-32 96H400z";
    static fasHouseUserViewBox = "0 0 576 512";

    //Font Awesome Pro 6.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc.
    static fasRotateRightPath = "M463.5 224H472c13.3 0 24-10.7 24-24V72c0-9.7-5.8-18.5-14.8-22.2s-19.3-1.7-26.2 5.2L413.4 96.6c-87.6-86.5-228.7-86.2-315.8 1c-87.5 87.5-87.5 229.3 0 316.8s229.3 87.5 316.8 0c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0c-62.5 62.5-163.8 62.5-226.3 0s-62.5-163.8 0-226.3c62.2-62.2 162.7-62.5 225.3-1L327 183c-6.9 6.9-8.9 17.2-5.2 26.2s12.5 14.8 22.2 14.8H463.5z"
    static fasRotateRightViewBox = "0 0 512 512";

    static instanceUserBadgeRegex = /([0-9]|[1-9][0-9]|[1-9][0-9][0-9]|[1-9][0-9][0-9][0-9]|Click)<svg/g;

    //リロードボタンを連続でクリックし、VRC側に負荷がかかりすぎない用のクールタイム
    static updateCoolTime = 0;

    /**
     * ロケーションカードにインスタンス人数を表示するバッジが存在するかどうか
     * @param {VRCLocationCard} locationCard 
     */
    static existsInstanceUserCountBadge(locationCard) {
        const htmlCollection = locationCard.instanceInfoListElement.getElementsByClassName(this.instanceUserCountBadgeClass);
        return htmlCollection.length > 0;
    }

    /**
     * ロケーションカードにインスタンス人数を更新するボタンが存在するかどうか
     * @param {VRCLocationCard} locationCard 
     * @returns 
     */
    static existsInstanceUserCountUpdateButton(locationCard) {
        const htmlCollection = locationCard.instanceInfoListElement.getElementsByClassName(this.instanceUserCountUpdateButtonClass);
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

            //バッジが"Click"状態の時にクリックしたら実行される
            const firstUpdate = () => { 
                //人数を表示 (取得)
                this.updateInstanceUserCountBadge(locationCard);
                //更新ボタンを追加
                this.addInstanceUserCountUpdateButton(locationCard);
                //以降バッジをクリックしてもこれが実行されないように削除する
                instanceUserCountBadge.removeEventListener("click", firstUpdate);
            }
            instanceUserCountBadge.addEventListener("click", firstUpdate);
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
     * インスタンスに居るユーザ数を更新するボタンを追加する
     * @param {VRCLocationCard} locationCard 
     */
    static addInstanceUserCountUpdateButton(locationCard) {
        //既に更新ボタンが追加されていたら実行しない
        if(!this.existsInstanceUserCountUpdateButton(locationCard)) {
            //更新ボタンをアイコン
            const rotateRightIconSVG = VRCDOM.createSVGIcon("Update number of users in the Instance", this.fasRotateRightPath, "#FFFFFF", this.fasRotateRightViewBox);
            //更新ボタン
            const updateButton = VRCDOM.createIconButton(rotateRightIconSVG, (e) => { 
                //前回の更新から10秒以上経過していたら (500msに一回カウントが追加される)
                if(this.updateCoolTime >= 10) {
                    this.updateInstanceUserCountBadge(locationCard);
                    this.updateCoolTime = 0;
                }
             });
            DOM.addClassList(updateButton, [ "me-sm-2", "flex-grow-0", this.instanceUserCountUpdateButtonClass ]);

            //Invite Meボタンの左にバッジを設置する
            locationCard.instanceInfoListElement.insertBefore(
                updateButton,
                locationCard.instanceInfoListElement.lastChild
            );
        }
    }

    /**
     * 
     * @param {VRCLocationCard} locationCard 
     */
    static setupInstanceInfoLayout(locationCard) {
        DOM.addClassList(locationCard.instanceInfoListElement, ["flex-wrap", "align-content-end"]);
        DOM.addClassList(locationCard.inviteMEButton, ["mt-2"]);
    }

    /**
     * ベターロケーションカードのセットアップを行う
     * ベターロケーションカードを使うにはこの処理を実行するればいい
     */
    static setupBetterLocationCard() {
        this.updateCoolTime++;
        //ロケーションカードが入ってるdiv要素
        const locationCardList = DOM.getByClass(this.locationsDivClassName);
        //存在しなかったら実行しない
        if(locationCardList.length == 0) {
            return;
        }
        //ロケーションカードをすべて取得する
        const locationCards = locationCardList[0].children;
        //forで回す
        for(let i = 0; i < locationCards.length; i++) {
            //ロケーションカードインスタンスを作成
            const locationCard = new VRCLocationCard(locationCards[i]);
            this.setupInstanceInfoLayout(locationCard);
            //インスタンスに居るユーザー数バッジを追加する
            this.addInstanceUserCountBadge(locationCard);
        }
    }
}