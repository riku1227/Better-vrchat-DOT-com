const isEmptyString = function(value) {
  if(value == "" || value == undefined || value == null) {
    return true;
  } else {
    return false;
  }
};

const VRChatAPI = {
  getWorldInstanceByID: function (worldId, instanceId) {
    return new Promise((callback) => {
      const request = new XMLHttpRequest();
      request.open("GET", `/api/1/worlds/${worldId}/${instanceId}`, true);
      request.onload = function () {
        callback(this);
      };
      request.send();
    });
  },

  getFavoriteAvatarIDs: function () {
    return new Promise((callback) => {
      const request = new XMLHttpRequest();
      request.open("GET", "/api/1/favorites?n=16&tags=avatars1");
      request.onload = function() {
        callback(this);
      }
      request.send();
    });
  },

  getFavoriteAvatars: function() {
    return new Promise((callback) => {
      const request = new XMLHttpRequest();
      request.open("GET", "/api/1/avatars/favorites?n=16");
      request.onload = function() {
        callback(this);
      }
      request.send();
    });
  },

  postInviteToMe: function (worldId, instanceId) {
    const request = new XMLHttpRequest();
    request.open("POST", `/api/1/instances/${worldId}:${instanceId}/invite`);
    request.send();
  },

  setAvatar: function(avatarId) {
    const request = new XMLHttpRequest();
    request.open("PUT", `/api/1/avatars/${avatarId}/select`);
    request.send();
  },

  deleteFavorite: function(favoriteId) {
    return new Promise((callback) => {
      const request = new XMLHttpRequest();
      request.open("DELETE", `/api/1/favorites/${favoriteId}`);
      request.onload = function() {
        callback(this);
      }
      request.send();
    });
  },

  removeVRChatComURL: function(url) {
    return url.replace("https://www.vrchat.com/", "").replace("https://vrchat.com/", "").replace("home/", "");
  }
};

const IntervalID = {
  avatarsInterval: 0
};

const DOMEditor = {
  getChildElementsByClassName: function(parent, className) {
    const childList = parent.children;
    const resultList = [];
    for(let i = 0; i < childList.length; i++) {
      if(childList[i].classList.contains(className)) {
        resultList.push(childList[i]);
      }
    }

    return resultList;
  },

  getChildElementsByTagName: function(parent, tagName) {
    const childList = parent.children;
    const resultList = [];
    for(let i = 0; i < childList.length; i++) {
      if(childList[i].tagName.toLowerCase() == tagName.toLowerCase()) {
        resultList.push(childList[i]);
      }
    }

    return resultList;
  },

  createButton: function (buttonText, buttonIconClassList, spanTitle) {
    const buttonDOM = document.createElement("button");
    buttonDOM.classList.add("btn");
    buttonDOM.classList.add("btn-secondary");
    buttonDOM.type = "button";

    buttonDOM.textContent = buttonText;

    if(buttonIconClassList.length > 0) {
      const buttonIconSpan = document.createElement("span");
      buttonIconSpan.title = spanTitle;
      buttonIconClassList.forEach((value) => {
        buttonIconSpan.classList.add(value);
      });

      if(buttonText != "" && buttonText != null && buttonText != undefined) {
        buttonIconSpan.style.marginRight = "8px";
      }

      buttonDOM.insertBefore(buttonIconSpan, buttonDOM.firstChild);
    }

    return buttonDOM;
  },

  createCollapseRowList: function(title, line) {
    const parentDiv = document.createElement("div");
    const parentH3 = document.createElement("h3");
    const collapseButton = DOMEditor.createButton(null, ["fa", "fa-plus-circle"]);
    collapseButton.style.marginRight = "8px";
    parentH3.textContent = title;
    parentH3.insertBefore(collapseButton, parentH3.firstChild);

    const collapseDiv = document.createElement("div");
    collapseDiv.classList.add("collapse");
    const listDiv = document.createElement("div");
    listDiv.classList.add(line);
    collapseDiv.appendChild(listDiv);

    collapseButton.addEventListener("click", () => {
      const buttonSpan = collapseButton.firstChild;
      if(collapseDiv.classList.contains("show")) {
        collapseDiv.classList.remove("show");

        buttonSpan.classList.remove("fa-minus-circle");
        buttonSpan.classList.add("fa-plus-circle");
      } else {
        collapseDiv.classList.add("show");

        buttonSpan.classList.remove("fa-plus-circle");
        buttonSpan.classList.add("fa-minus-circle");
      }
    });

    parentDiv.appendChild(parentH3);

    parentDiv.appendChild(collapseDiv);

    return {
      parent: parentDiv,
      list: listDiv
    };
  },

  createAvatarContainer: function(avatarName, avatarDescription, avatarThumbUrl, avatarId, favoriteId) {
    const parentDiv = document.createElement("div");
    parentDiv.classList.add("css-bj8sxz");
    parentDiv.classList.add("col-12");

    const searchContainer = document.createElement("div");
    searchContainer.classList.add("search-container");
    parentDiv.appendChild(searchContainer);

    const rowDiv = document.createElement("div");
    rowDiv.classList.add("row");
    searchContainer.appendChild(rowDiv);

    const colLeftContainer = document.createElement("div");
    colLeftContainer.classList.add("col-12");
    colLeftContainer.classList.add("col-md-4");
    rowDiv.appendChild(colLeftContainer);

    const imgATagContainer = document.createElement("a");
    imgATagContainer.href = `/home/avatar/${avatarId}`;
    colLeftContainer.appendChild(imgATagContainer);

    const avatarThumbImg = document.createElement("img");
    avatarThumbImg.classList.add("w-100");
    avatarThumbImg.src = avatarThumbUrl;
    avatarThumbImg.title = avatarName;
    imgATagContainer.appendChild(avatarThumbImg);

    const colRightContainer = document.createElement("div");
    colRightContainer.classList.add("col-12");
    colRightContainer.classList.add("col-md-8");
    rowDiv.appendChild(colRightContainer);

    const avatarTitleH4 = document.createElement("h4");
    colRightContainer.appendChild(avatarTitleH4);
    
    const avatarTitleA = document.createElement("a");
    avatarTitleA.href = `/home/avatar/${avatarId}`;
    avatarTitleA.textContent = avatarName;
    avatarTitleH4.appendChild(avatarTitleA);

    if(!isEmptyString(avatarDescription)) {
      const avatarDescriptionP = document.createElement("p");
      avatarDescriptionP.textContent = avatarDescription;
      colRightContainer.appendChild(avatarDescriptionP); 
    }

    const setAvatarButton = DOMEditor.createButton("Set Avatar", ["fas", "fa-user-tie"], "Set avatar");
    setAvatarButton.addEventListener("click", () => {
      VRChatAPI.setAvatar(avatarId);
    });
    colRightContainer.appendChild(setAvatarButton);

    if(!isEmptyString(favoriteId)) {
      const unFavoriteButton = DOMEditor.createButton("Unfav Avatar", ["fas", "fa-user-minus"]);
      unFavoriteButton.addEventListener("click", () => {
        if(window.confirm("アバターのFavoriteを解除しますか？\nUnfav avatar?")) {
          VRChatAPI.deleteFavorite(favoriteId).then((request) => {
            parentDiv.remove();
          })
        }
      });
      unFavoriteButton.style.marginLeft = "8px";
      colRightContainer.appendChild(unFavoriteButton);
    }

    return parentDiv;
  }
};

window.onload = function () {
  const instanceInfoCache = new Map();
  const instanceInfoElement = new Map();

  let reloadButtonTimer = 0;

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

  const loadInstanceUserCount = function (locationTitleElement, worldId, instanceId) {
    const cacheName = `${worldId}:${instanceId}`;
    if (instanceInfoCache[cacheName] != undefined) {
      createInstanceUserCountDOM(locationTitleElement, instanceInfoCache[cacheName]);
    } else {
      if (instanceInfoElement[cacheName] != undefined) {
        instanceInfoElement[cacheName].push(locationTitleElement);
      } else {
        instanceInfoElement[cacheName] = new Array(locationTitleElement);

        VRChatAPI.getWorldInstanceByID(worldId, instanceId).then((request) => {
          const jsonObject = JSON.parse(request.response);
          const userCount = jsonObject.n_users;
          instanceInfoCache[cacheName] = userCount;

          for (let i = 0; i < instanceInfoElement[cacheName].length; i++) {
            createInstanceUserCountDOM(instanceInfoElement[cacheName][i], userCount);
          }
        });
      }
    }
  }

  const createInviteMeDom = function (locationCardElement) {
    if (locationCardElement.getElementsByClassName("vrchatplus_invite_me_button").length <= 0) {
      const clearfixDiv = locationCardElement.getElementsByClassName("clearfix")[0];

      const buttonDom = document.createElement("button");
      buttonDom.classList.add("btn");
      buttonDom.classList.add("btn-secondary");
      buttonDom.classList.add("vrchatplus_invite_me_button");
      buttonDom.type = "button";
      buttonDom.textContent = "INVITE ME";

      const splitHref = locationCardElement.getElementsByTagName("a")[0].href.split("worldId=")[1].split("&instanceId=");

      locationCardElement.insertBefore(buttonDom, clearfixDiv);

      buttonDom.addEventListener("click", function () {
        VRChatAPI.postInviteToMe(splitHref[0], splitHref[1]);
      });
    }
  }

  const createReLoadDOM = function (locationCardElement) {
    if (locationCardElement.getElementsByClassName("vrchatplus_reload_instance_user_count").length <= 0) {
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
      reloadButtonDOM.addEventListener("click", function () {
        if (reloadButtonTimer >= 1) {
          reloadButtonTimer = 0;

          VRChatAPI.getWorldInstanceByID(splitHref[0], splitHref[1]).then((request) => {
            const cacheName = `${splitHref[0]}:${splitHref[1]}`;

            const jsonObject = JSON.parse(request.response);
            const userCount = jsonObject.n_users;
            instanceInfoCache[cacheName] = userCount;

            const countSpan = locationCardElement.getElementsByClassName("vrchat_instance_user_count")[0];
            countSpan.parentNode.removeChild(countSpan);

            createInstanceUserCountDOM(locationCardElement.getElementsByClassName("vrchatplus_location_title")[0], instanceInfoCache[cacheName]);
          });
        }
      });
    }
  }

  const intervalFunction = function () {
    if (window.location.href.indexOf("login") == -1) {
      reloadButtonTimer++;

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
        loadInstanceUserCount(locationTitleElement, worldId, instanceId);
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

  const avatarsFunction = function () {
    if (location.href.indexOf("home/avatars") != -1) {

      const intervalAvatar = function () {
        const privateContainers = document.getElementsByClassName("private");
        for (let i = 0; i < privateContainers.length; i++) {
          const privateContainer = privateContainers[i];
          privateContainer.classList.remove("private");

          
          const privateAvatarContent = DOMEditor.getChildElementsByClassName(privateContainer.firstElementChild, "col-md-8");
          const buttonDOM = DOMEditor.createButton("Set Avatar", ["fas", "fa-user-tie"], "Set Avatar");
          buttonDOM.addEventListener("click", ()=> {
            const avatarId = VRChatAPI.removeVRChatComURL(
              DOMEditor.getChildElementsByTagName(privateAvatarContent[0], "h4")[0].firstChild.href
              ).replace("avatar/", "");
            VRChatAPI.setAvatar(avatarId);
          });
          privateAvatarContent[0].appendChild(buttonDOM);
        }
      };

      IntervalID.avatarsInterval = setInterval(intervalAvatar, 1500);

      const homeContent = document.getElementsByClassName("home-content")[0];
      const col12 = DOMEditor.getChildElementsByClassName(DOMEditor.getChildElementsByClassName(homeContent, "row")[0], "col-12")[0];

      const favoriteAvatarListDOM = DOMEditor.createCollapseRowList("Favorite Avatars", "row");
      col12.appendChild(favoriteAvatarListDOM.parent);

      favoriteAvatarListDOM.parent.style.display = "none";

      const favoriteAvatarsMap = new Map();

      VRChatAPI.getFavoriteAvatarIDs().then((request) => {
        const favoriteIds = JSON.parse(request.response);
        favoriteIds.forEach((value) => {
          favoriteAvatarsMap.set(value.favoriteId,
          {
            avatarId: value.favoriteId,
            favoriteId: value.id
          });
        });

        return VRChatAPI.getFavoriteAvatars();
      })
      .then((request) => {
        const favoriteAvatars = JSON.parse(request.response);
        favoriteAvatars.forEach((value) => {
          const avatarObject = favoriteAvatarsMap.get(value.id);
          if(avatarObject != undefined) {
            avatarObject.name = value.name;
            avatarObject.description = value.description;
            avatarObject.thumbUrl = value.thumbnailImageUrl;

            favoriteAvatarsMap.set(value.id, avatarObject);
          }
        });

        favoriteAvatarsMap.forEach((value, key) => {
          const favoriteAvatarContainer = DOMEditor.createAvatarContainer(value.name, value.description, value.thumbUrl, value.avatarId, value.favoriteId);
          favoriteAvatarListDOM.list.appendChild(favoriteAvatarContainer);
        });

        favoriteAvatarListDOM.parent.style.display = "block";
      });
    }
  };

  const bodyContent = document.getElementById("home");
  console.log(bodyContent);

  const bodyObserver = new MutationObserver((mutations) => {
    mutations.forEach(() => {
      avatarsFunction();
      const homeContent = document.getElementsByClassName("home-content")[0];
      const homeContentObserver = new MutationObserver(() => {
        clearInterval(IntervalID.avatarsInterval);

        avatarsFunction();
      });

      homeContentObserver.observe(homeContent, {
        childList: true
      });
    });
  });

  bodyObserver.observe(bodyContent, {
    childList: true
  });
};