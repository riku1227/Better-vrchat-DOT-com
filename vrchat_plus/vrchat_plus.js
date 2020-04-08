window.onload = function () {
    const instanceInfoCache = new Map();
    const instanceInfoElement = new Map();

    const createInstanceUserCountDOM = function (locationTitleElement, userCount) {
        const userCountSpan = document.createElement("span");
        userCountSpan.classList.add("badge");
        userCountSpan.classList.add("badge-secondary");
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
        const parentDiv = locationCardElement.firstElementChild;
        if(parentDiv.getElementsByClassName("vrchatplus_invite_me_button").length <= 0) {
            const clearfixDiv = parentDiv.getElementsByClassName("clearfix")[0];

            const buttonDom = document.createElement("button");
            buttonDom.classList.add("btn");
            buttonDom.classList.add("btn-secondary");
            buttonDom.classList.add("vrchatplus_invite_me_button");
            buttonDom.type = "button";
            buttonDom.textContent = "INVITE ME";

            const splitHref = parentDiv.getElementsByTagName("a")[0].href.split("worldId=")[1].split("&instanceId=");

            parentDiv.insertBefore(buttonDom, clearfixDiv);

            buttonDom.addEventListener("click", function() {
                postInviteToMe(splitHref[0], splitHref[1]);
            });
        }
    }

    const intervalFunction = function () {
        if (window.location.href.indexOf("login") == -1) {
            const locationTitles = document.getElementsByClassName("location-title");

            for (let i = 0; i < locationTitles.length; i++) {
                const locationTitleElement = locationTitles[i];

                locationTitleElement.classList.remove("location-title");
                const locationTitleATag = locationTitleElement.getElementsByTagName("a")[0];
                locationTitleATag.style.color = "#FFFFFF";
                const splitHref = locationTitleATag.href.split("worldId=")[1].split("&instanceId=");
                const worldId = splitHref[0];
                const instanceId = splitHref[1];
                getInstanceById(locationTitleElement, worldId, instanceId);
            }

            const loactionCards = document.getElementsByClassName("location-card");
            for (let i = 0; i < loactionCards.length; i++) {
                const locationCard = loactionCards[i];
                createInviteMeDom(locationCard);
            }
        }
    }

    setInterval(intervalFunction, 3000);
};