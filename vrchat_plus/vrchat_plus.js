window.onload = function () {
    const instanceInfoCache = new Map();
    const instanceInfoElement = new Map();

    const createInstanceUserCountDOM = function (locationTitleElement, userCount) {
        const userCountSpan = document.createElement("span");
        userCountSpan.classList.add("badge");
        userCountSpan.classList.add("badge-secondary");
        userCountSpan.classList.add("vrchat_instance_user_count");
        userCountSpan.textContent = `${userCount} `;

        const userCountIconSpan = document.createElement("span");
        userCountIconSpan.title = "Number of users in instance";
        userCountIconSpan.classList.add("fa");
        userCountIconSpan.classList.add("fa-user-circle");

        const spaceSpan = document.createElement("span");
        spaceSpan.style.width = "20px";
        spaceSpan.style.height = "20px";
        spaceSpan.textContent = " ";

        userCountSpan.appendChild(userCountIconSpan);
        const friendsSpan = locationTitleElement.getElementsByTagName("span")[0];
        locationTitleElement.insertBefore(spaceSpan, friendsSpan);
        locationTitleElement.insertBefore(userCountSpan, spaceSpan);
    }

    const getInstanceById = function (locationTitleElement, worldId, instanceId) {
        const cacheName = `${worldId}:${instanceId}`;
        if (instanceInfoCache[cacheName] != undefined) {
            createInstanceUserCountDOM(locationTitleElement, instanceInfoCache[cacheName]);
        } else {
            if (instanceInfoElement[cacheName] != undefined) {
                instanceInfoElement[cacheName].push(locationTitleElement);
            } else {
                instanceInfoElement[cacheName] = new Array(locationTitleElement);

                const request = new XMLHttpRequest();
                request.withCredentials = true;
                request.open("GET", `/api/1/worlds/${worldId}/${instanceId}`, true);
                request.onload = function () {
                    const jsonObject = JSON.parse(this.response);
                    const userCount = jsonObject.n_users;
                    instanceInfoCache[cacheName] = userCount;

                    for (let i = 0; i < instanceInfoElement[cacheName].length; i++) {
                        createInstanceUserCountDOM(instanceInfoElement[cacheName][i], userCount);
                    }
                }
                request.send();
            }
        }
    }

    const postInviteToMe = function(worldId, instanceId) {
        const request = new XMLHttpRequest();
        request.withCredentials = true;
        request.open("POST", `/api/1/instances/${worldId}:${instanceId}/invite`);
        request.send();
    }

    const createInviteMeDom = function(locationCardElement) {
        if(locationCardElement.getElementsByClassName("vrchatplus_invite_me_button").length <= 0) {
            const clearfixDiv = locationCardElement.getElementsByClassName("clearfix")[0];

            const buttonDom = document.createElement("button");
            buttonDom.classList.add("btn");
            buttonDom.classList.add("btn-secondary");
            buttonDom.classList.add("vrchatplus_invite_me_button");
            buttonDom.type = "button";
            buttonDom.textContent = "INVITE ME";

            const splitHref = locationCardElement.getElementsByTagName("a")[0].href.split("worldId=")[1].split("&instanceId=");

            locationCardElement.insertBefore(buttonDom, clearfixDiv);

            buttonDom.addEventListener("click", function() {
                postInviteToMe(splitHref[0], splitHref[1]);
            });
        }
    }

    const createReLoadDOM = function(locationCardElement) {
        if(locationCardElement.getElementsByClassName("vrchatplus_reload_instance_user_count").length <= 0) {
            const inviteMeDOM = locationCardElement.getElementsByClassName("vrchatplus_invite_me_button")[0];

            const reloadButtonDOM = document.createElement("button");
            reloadButtonDOM.classList.add("btn");
            reloadButtonDOM.classList.add("btn-secondary");
            reloadButtonDOM.classList.add("vrchatplus_reload_instance_user_count");
            reloadButtonDOM.type = "button";

            const userCountIconSpan = document.createElement("span");
            userCountIconSpan.title = "Reload number of users in instance";
            userCountIconSpan.classList.add("fas");
            userCountIconSpan.classList.add("fa-sync-alt");

            reloadButtonDOM.appendChild(userCountIconSpan);

            locationCardElement.insertBefore(reloadButtonDOM, inviteMeDOM);

            const spaceSpan = document.createElement("span");
            spaceSpan.style.width = "20px";
            spaceSpan.style.height = "20px";
            spaceSpan.textContent = " ";

            locationCardElement.insertBefore(spaceSpan, reloadButtonDOM.nextSibling);

            const splitHref = locationCardElement.getElementsByTagName("a")[0].href.split("worldId=")[1].split("&instanceId=");
            reloadButtonDOM.addEventListener("click", function() {
                const request = new XMLHttpRequest();
                request.withCredentials = true;
                request.open("GET", `/api/1/worlds/${splitHref[0]}/${splitHref[1]}`, true);
                request.onload = function() {
                    const cacheName = `${splitHref[0]}:${splitHref[1]}`;

                    const jsonObject = JSON.parse(this.response);
                    const userCount = jsonObject.n_users;
                    instanceInfoCache[cacheName] = userCount;

                    const countSpan = locationCardElement.getElementsByClassName("vrchat_instance_user_count")[0];
                    countSpan.parentNode.removeChild(countSpan);
                    
                    createInstanceUserCountDOM(locationCardElement.getElementsByClassName("vrchatplus_location_title")[0], instanceInfoCache[cacheName]);
                }
                request.send();
            });
        }
    }

    const intervalFunction = function () {
        if (window.location.href.indexOf("login") == -1) {
            const locationTitles = document.getElementsByClassName("location-title");

            for (let i = 0; i < locationTitles.length; i++) {
                const locationTitleElement = locationTitles[i];

                locationTitleElement.classList.remove("location-title");
                locationTitleElement.classList.add("vrchatplus_location_title");
                const locationTitleATag = locationTitleElement.getElementsByTagName("a")[0];
                locationTitleATag.style.color = "#FFFFFF";
                const splitHref = locationTitleATag.href.split("worldId=")[1].split("&instanceId=");
                const worldId = splitHref[0];
                const instanceId = splitHref[1];
                getInstanceById(locationTitleElement, worldId, instanceId);
            }

            const loactionCards = document.getElementsByClassName("location-card");
            for (let i = 0; i < loactionCards.length; i++) {
                const locationCard = loactionCards[i].firstElementChild;
                createInviteMeDom(locationCard);
                createReLoadDOM(locationCard);
            }
        }
    }

    setInterval(intervalFunction, 3000);
};