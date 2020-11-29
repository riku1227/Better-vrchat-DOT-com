class BetterLocationCard {

    static classReplaceTitle = "better_vrc_dot_com_location_title";
    static classUserCountBadge = "better_vrc_dot_com_user_count";
    static classInviteMEButton = "better_vrc_dot_com_invite_me_button";
    static classReLoadButton = "better_vrc_dot_com_reload_instance_user_count";

    static instanceInfoCache = new Map();
    static reloadButtonTimer = 0;

    static getInstanceUrlFromCard(locationCardElement) {
        return locationCardElement.getElementsByTagName("a")[0].href;
    }
    
    static addInstanceUserCount (locationTitleElement, userCount) {
        const userCountSpan = VRCDOM.createIconBadge(["fa", "fa-user-circle"], userCount, "Number of users in instance");
        userCountSpan.classList.add(this.classUserCountBadge);
        const spaceSpan = VRCDOM.createSpaceSpan();

        const friendCountSpan = locationTitleElement.getElementsByTagName("span")[0];
        locationTitleElement.insertBefore(spaceSpan, friendCountSpan);
        locationTitleElement.insertBefore(userCountSpan, spaceSpan);
    }

    static setupInstanceUserCount (locationTitle, worldId, instanceId) {
        const cacheName = `${worldId}:${instanceId}`;
        if(this.instanceInfoCache[cacheName] != undefined) {
            this.addInstanceUserCount(locationTitle, this.instanceInfoCache[cacheName]);
        } else {
            VRChatAPI.getWorldInstanceByID(worldId, instanceId).then((request) => {
                const resultObject = JSON.parse(request.response);
                const userCount = resultObject.n_users;
                this.instanceInfoCache[cacheName] = userCount;

                this.addInstanceUserCount(locationTitle, userCount);
            });
        }
    }

    static setupInviteMEButton(locationCardElement) {
        if(locationCardElement.getElementsByClassName(this.classInviteMEButton).length <= 0) {
            const clearFixDiv = locationCardElement.getElementsByClassName("clearfix")[0];

            const inviteMEButton = VRCDOM.createButton("INVITE ME");
            inviteMEButton.classList.add(this.classInviteMEButton);

            const instanceUrl = this.getInstanceUrlFromCard(locationCardElement);
            const worldId = VRCUtil.getWorldIDFromURL(instanceUrl);
            const instanceId = VRCUtil.getInstanceIDFromURL(instanceUrl);

            locationCardElement.firstChild.insertBefore(inviteMEButton, clearFixDiv);

            inviteMEButton.addEventListener("click", () => {
                VRChatAPI.postInviteToME(worldId, instanceId);
            })
        }
    }

    static setupReLoadButton(locationCardElement) {
        if(locationCardElement.getElementsByClassName(this.classReLoadButton).length <= 0) {
            const inviteMEButton = locationCardElement.getElementsByClassName(this.classInviteMEButton)[0];

            const reloadButton = VRCDOM.createButton("", ["fas", "fa-sync-alt"], "Reload number of users in instance");
            reloadButton.classList.add(this.classReLoadButton);

            locationCardElement.firstChild.insertBefore(reloadButton, inviteMEButton);

            const spaceSpan = VRCDOM.createSpaceSpan();
            locationCardElement.firstChild.insertBefore(spaceSpan, reloadButton.nextElementSibling);
            
            const instanceUrl = this.getInstanceUrlFromCard(locationCardElement);
            const worldId = VRCUtil.getWorldIDFromURL(instanceUrl);
            const instanceId = VRCUtil.getInstanceIDFromURL(instanceUrl);

            reloadButton.addEventListener("click", () => {
                if(this.reloadButtonTimer >= 1) {
                    this.reloadButtonTimer = 0;

                    VRChatAPI.getWorldInstanceByID(worldId, instanceId).then((request) => {
                        const cacheName = `${worldId}:${instanceId}`;
                        const resultObject = JSON.parse(request.response);
                        const userCount = resultObject.n_users;
                        this.instanceInfoCache[cacheName] = userCount;

                        const countSpan = locationCardElement.getElementsByClassName(this.classUserCountBadge)[0];
                        countSpan.parentNode.removeChild(countSpan);

                        this.addInstanceUserCount(locationCardElement.getElementsByClassName(this.classReplaceTitle)[0], userCount);
                    })
                }
            });
        }
    }

    static setupLocationCard () {
        this.reloadButtonTimer++;
        const locationCards = DOM.getByClass("location-card");
        for(let i = 0; i < locationCards.length; i++) {
            const locationCard = locationCards[i];
            const locationTitle = locationCard.getElementsByClassName("location-title")[0];

            if(locationTitle) {
                locationTitle.classList.remove("location-title");
                locationTitle.classList.add(this.classReplaceTitle);

                const locationTitleA = locationTitle.getElementsByTagName("a")[0];
                locationTitleA.classList.add("better_vrc_dot_com_location_title_a");

                const instanceUrl = locationTitleA.href;
                const worldId = VRCUtil.getWorldIDFromURL(instanceUrl)
                const instanceId = VRCUtil.getInstanceIDFromURL(instanceUrl)

                this.setupInstanceUserCount(locationTitle, worldId, instanceId);
            }

            this.setupInviteMEButton(locationCard);
            this.setupReLoadButton(locationCard);
        }
    }
};