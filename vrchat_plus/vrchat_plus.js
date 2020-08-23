const isEmptyString = function (value) {
  if (value == "" || value == undefined || value == null) {
    return true;
  } else {
    return false;
  }
};

const saveFile = function (fileName, blob) {
  const aTag = document.createElement("a");

  aTag.download = fileName;
  aTag.href = URL.createObjectURL(blob);
  aTag.click();
}

const readFileAsText = function (file) {
  return new Promise((callback) => {
    const fileReader = new FileReader();
    fileReader.readAsText(file);
    fileReader.onload = function () {
      callback(fileReader.result);
    }
  });
}

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

  getAvatar: function (avatarId) {
    return new Promise((callback) => {
      const request = new XMLHttpRequest();
      request.open("GET", `/api/1/avatars/${avatarId}`);
      request.onload = function () {
        callback(this);
      }
      request.send();
    });
  },

  getFavoriteAvatarIDs: function () {
    return new Promise((callback) => {
      const request = new XMLHttpRequest();
      request.open("GET", "/api/1/favorites?n=16&tags=avatars1");
      request.onload = function () {
        callback(this);
      }
      request.send();
    });
  },

  getFavoriteAvatars: function () {
    return new Promise((callback) => {
      const request = new XMLHttpRequest();
      request.open("GET", "/api/1/avatars/favorites?n=50");
      request.onload = function () {
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

  addFavoriteAvatar: function (avatarId) {
    return new Promise((callback) => {
      const request = new XMLHttpRequest();
      request.open("POST", "/api/1/favorites");
      request.onload = function () {
        callback(this);
      }
      request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      request.send(`type=avatar&favoriteId=${avatarId}&tags=avatars1`);
    });
  },

  setAvatar: function (avatarId) {
    const request = new XMLHttpRequest();
    request.open("PUT", `/api/1/avatars/${avatarId}/select`);
    request.send();
  },

  deleteFavorite: function (favoriteId) {
    return new Promise((callback) => {
      const request = new XMLHttpRequest();
      request.open("DELETE", `/api/1/favorites/${favoriteId}`);
      request.onload = function () {
        callback(this);
      }
      request.send();
    });
  },

  removeVRChatComURL: function (url) {
    return url.replace("https://www.vrchat.com/", "").replace("https://vrchat.com/", "").replace("home/", "");
  }
};

const IntervalID = {
  avatarsInterval: 0
};

const DOMEditor = {
  getChildElementsByClassName: function (parent, className) {
    const childList = parent.children;
    const resultList = [];
    for (let i = 0; i < childList.length; i++) {
      if (childList[i].classList.contains(className)) {
        resultList.push(childList[i]);
      }
    }

    return resultList;
  },

  getChildElementsByTagName: function (parent, tagName) {
    const childList = parent.children;
    const resultList = [];
    for (let i = 0; i < childList.length; i++) {
      if (childList[i].tagName.toLowerCase() == tagName.toLowerCase()) {
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

    if (buttonIconClassList.length > 0) {
      const buttonIconSpan = document.createElement("span");
      buttonIconSpan.title = spanTitle;
      buttonIconClassList.forEach((value) => {
        buttonIconSpan.classList.add(value);
      });

      if (buttonText != "" && buttonText != null && buttonText != undefined) {
        buttonIconSpan.style.marginRight = "8px";
      }

      buttonDOM.insertBefore(buttonIconSpan, buttonDOM.firstChild);
    }

    return buttonDOM;
  },

  createCollapseRowList: function (title, line) {
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
      if (collapseDiv.classList.contains("show")) {
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

  createAvatarContainer: function (avatarName, avatarDescription, avatarThumbUrl, avatarId, favoriteId) {
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

    if (!isEmptyString(avatarDescription)) {
      const avatarDescriptionP = document.createElement("p");
      avatarDescriptionP.textContent = avatarDescription;
      colRightContainer.appendChild(avatarDescriptionP);
    }

    const setAvatarButton = DOMEditor.createButton("Set Avatar", ["fas", "fa-user-tie"], "Set avatar");
    setAvatarButton.addEventListener("click", () => {
      VRChatAPI.setAvatar(avatarId);
    });
    colRightContainer.appendChild(setAvatarButton);

    if (!isEmptyString(favoriteId)) {
      const unFavoriteButton = DOMEditor.createButton("Unfav Avatar", ["fas", "fa-user-minus"]);
      unFavoriteButton.addEventListener("click", () => {
        if (window.confirm("アバターのFavoriteを解除しますか？\nUnfav avatar?")) {
          VRChatAPI.deleteFavorite(favoriteId).then((request) => {
            parentDiv.remove();
          })
        }
      });
      unFavoriteButton.style.marginLeft = "8px";
      colRightContainer.appendChild(unFavoriteButton);
    }

    return parentDiv;
  },

  createTextInputForm: function (inputId, placeholder, buttonIconClassList) {
    const parentDiv = document.createElement("div");
    parentDiv.classList.add("input-group");

    const textInput = document.createElement("input");
    textInput.type = "text";
    textInput.classList.add("form-control");
    textInput.placeholder = placeholder;
    textInput.id = inputId;
    parentDiv.appendChild(textInput);

    const appendSpan = document.createElement("span");
    appendSpan.classList.add("input-group-append");
    const buttonElement = document.createElement("button");
    buttonElement.classList.add("btn");
    buttonElement.classList.add("btn-outline-secondary");

    if (buttonIconClassList.length > 0) {
      const buttonIconSpan = document.createElement("span");
      buttonIconClassList.forEach((value) => {
        buttonIconSpan.classList.add(value);
      });
      buttonElement.appendChild(buttonIconSpan);
      appendSpan.appendChild(buttonElement);
    }
    parentDiv.appendChild(appendSpan);

    return {
      parent: parentDiv,
      button: buttonElement,
      input: textInput
    };
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
          buttonDOM.addEventListener("click", () => {
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

      const addFavoriteTitle = document.createElement("h4");
      addFavoriteTitle.textContent = "アバターをお気に入り登録する";
      addFavoriteTitle.style.marginLeft = "16px";
      addFavoriteTitle.style.marginBottom = "0px";
      favoriteAvatarListDOM.list.appendChild(addFavoriteTitle);
      const addFavoriteAvatarForm = DOMEditor.createTextInputForm("vrchat_plus_add_favorite_avatar_input", "Avatar ID", ["fas", "fa-plus"]);
      addFavoriteAvatarForm.parent.style.margin = "16px";

      const messageP = document.createElement("p");
      messageP.style.marginLeft = "16px";
      messageP.style.whiteSpace = "pre-wrap";

      let avatarContainerPrevElement = messageP;

      addFavoriteAvatarForm.button.addEventListener("click", () => {
        const avatarIdRegex = /avtr_[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}/
        const formValue = addFavoriteAvatarForm.input.value;
        if (avatarIdRegex.test(formValue)) {
          VRChatAPI.addFavoriteAvatar(formValue).then((request) => {
            const nowDate = new Date();
            let resultMessage = "";
            let resultStatusCode = request.status;
            let favoriteId = "";

            switch (resultStatusCode) {
              case 200:
                resultMessage = `アバターをお気に入りに追加しました`;
                addFavoriteAvatarForm.input.value = "";

                const favoriteObject = JSON.parse(request.response);
                favoriteId = favoriteObject.id;
                break;
              case 404:
                resultMessage = `入力されたアバターIDのアバターが見つかりませんでした`;
                break;
              case 400:
                const errorJson = JSON.parse(request.response);
                if (errorJson.error.message == "You already have that avatar favorited") {
                  resultMessage = `これ以上アバターをお気に入りに登録することはできません`;
                } else {
                  resultMessage = `原因不明のエラーが発生しました\n[Status Code: ${request.status}]: ${request.response}`;
                }
                break;
              default:
                resultMessage = `原因不明のエラーが発生しました\n[Status Code: ${request.status}]: ${request.response}`;
            }

            messageP.textContent = `[${nowDate.getHours()}:${nowDate.getMinutes()}:${nowDate.getSeconds()}] ${resultMessage}`;
            if (resultStatusCode == 200) {
              VRChatAPI.getAvatar(formValue).then((request) => {
                if (request == undefined) {
                  return;
                }

                const avatarObject = JSON.parse(request.response);
                const addFavoriteAvatarContainer = DOMEditor.createAvatarContainer(avatarObject.name, avatarObject.description, avatarObject.thumbnailImageUrl, avatarObject.id, favoriteId);
                addFavoriteAvatarContainer.classList.add("vrchat_plus_favorite_avatars_container");

                favoriteAvatarListDOM.list.insertBefore(addFavoriteAvatarContainer, avatarContainerPrevElement.nextSibling);
              });
            }
          });
        } else {
          const nowDate = new Date();
          messageP.textContent = `[${nowDate.getHours()}:${nowDate.getMinutes()}:${nowDate.getSeconds()}] アバターIDを入力してください`;
        }
      });

      favoriteAvatarListDOM.list.appendChild(addFavoriteAvatarForm.parent);
      favoriteAvatarListDOM.list.appendChild(messageP);

      const fapTitle = document.createElement("h4");
      fapTitle.textContent = "Favorite Avatar Preset System (FAP System)";
      const fapDescriptionP = document.createElement("p");
      fapDescriptionP.textContent = "プリセット(FAP)のエクスポート\nファイル名をフォームに記入し、「Export FAP」ボタンを押してください\n\nプリセットのロード\n「ファイルを選択」 ボタンを押し、プリセット(FAP)ファイルを読み込ませ\n「Import FAP」ボタンを押すと確認ダイアログが出てくるので、内容をしっかり読みOKを押してください\nインポート完了すると「インポート完了」と出てきます";
      fapDescriptionP.style.whiteSpace = "pre-wrap";
      fapDescriptionP.style.marginLeft = "20px";
      fapDescriptionP.style.width = "100%";

      favoriteAvatarListDOM.list.appendChild(fapTitle);
      favoriteAvatarListDOM.list.appendChild(fapDescriptionP);

      const fapFileNameForm = DOMEditor.createTextInputForm("vrchat_plus_fap_file_name_input", "Preset Name", []);
      fapFileNameForm.parent.style.width = "420px";
      fapFileNameForm.parent.style.marginLeft = "16px";
      fapFileNameForm.parent.style.marginRight = "8px";
      favoriteAvatarListDOM.list.appendChild(fapFileNameForm.parent);

      const exportButton = DOMEditor.createButton("Export FAP", []);
      exportButton.style.marginBottom = "16px";
      favoriteAvatarListDOM.list.appendChild(exportButton);
      exportButton.addEventListener("click", () => {
        VRChatAPI.getFavoriteAvatars().then((request) => {
          const presetName = document.getElementById("vrchat_plus_fap_file_name_input").value;
          const avatarsObject = JSON.parse(request.response);
          const fapObject = {
            presetName: presetName,
            avatars: []
          }

          avatarsObject.forEach((value) => {
            fapObject.avatars.push(value.id);
          });

          const fapJsonStr = JSON.stringify(fapObject, null, 2);

          saveFile(`FAP_${presetName}.json`, new Blob([fapJsonStr], { type: "text/plain" }));
        });
      });

      const importInput = document.createElement("input");
      importInput.type = "file";
      importInput.style.marginLeft = "36px";
      favoriteAvatarListDOM.list.appendChild(importInput);
      const importButton = DOMEditor.createButton("Import FAP", []);
      importButton.style.marginBottom = "16px";
      avatarContainerPrevElement = importButton;
      favoriteAvatarListDOM.list.appendChild(importButton);
      importButton.addEventListener("click", () => {
        const jsonFiles = importInput.files;
        let fapObject = {};
        readFileAsText(jsonFiles[0]).then((result) => {
          try {
            fapObject = JSON.parse(result);
            if (fapObject.presetName == undefined || fapObject.avatars.length == 0) {
              alert("選択されたファイルはFAP形式ではないか、アバターリストの中が空です");
            } else {
              if (window.confirm(`お気に入りアバタープリセット 「${fapObject.presetName}」 をロードしますか？`)) {
                if (window.confirm("現在お気に入り登録されているアバターはすべて上書きされます\nFAPをエクスポートするなど必ずバックアップ/上書きされても問題ない状態にしてくさだい\n本当にお気に入りプリセットをロードしますか？")) {
                  return VRChatAPI.getFavoriteAvatarIDs();
                }
              }
            }
          } catch (e) {
            alert("選択されたファイルはJSON形式ではありません");
          }
        }).then((request) => {
          if (request == undefined) {
            return new Promise((callback) => {
              callback("isError");
            });
          }

          const currentFavoriteIds = JSON.parse(request.response);
          const promises = [];
          currentFavoriteIds.forEach((value) => {
            promises.push(VRChatAPI.deleteFavorite(value.id));
          });
          return Promise.all(promises);
        }).then((requests) => {
          if(requests == "isError") {
            return;
          }
          const removeFavoriteContainer = document.getElementsByClassName("vrchat_plus_favorite_avatars_container");
          const removeFavoriteContainerSize = removeFavoriteContainer.length;
          for (let i = 0; i < removeFavoriteContainerSize; i++) {
            removeFavoriteContainer[0].remove();
          }
          
          const importPromise = []
          fapObject.avatars.forEach((value) => {
            importPromise.push(VRChatAPI.addFavoriteAvatar(value));
          });
          return Promise.all(importPromise);
        }).then((requests) => {
          if(requests == undefined) {
            return;
          }
          const requestsSize = requests.length;
          let requestsCount = 0;
          requests.forEach((value) => {
            if(value.status == 200) {
              const addFavoriteResult = JSON.parse(value.response);
              VRChatAPI.getAvatar(addFavoriteResult.favoriteId).then((request) => {
                requestsCount++;
                const avatarObject = JSON.parse(request.response);
                const avatarContainer = DOMEditor.createAvatarContainer(avatarObject.name, avatarObject.description, avatarObject.thumbnailImageUrl, avatarObject.id, addFavoriteResult.id);
                avatarContainer.classList.add("vrchat_plus_favorite_avatars_container");
                favoriteAvatarListDOM.list.appendChild(avatarContainer);

                if(requestsCount >= requestsSize) {
                  alert("インポート完了！");
                }
              });
            }
          });
        });
      });

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
            if (avatarObject != undefined) {
              avatarObject.name = value.name;
              avatarObject.description = value.description;
              avatarObject.thumbUrl = value.thumbnailImageUrl;

              favoriteAvatarsMap.set(value.id, avatarObject);
            }
          });

          favoriteAvatarsMap.forEach((value, key) => {
            const favoriteAvatarContainer = DOMEditor.createAvatarContainer(value.name, value.description, value.thumbUrl, value.avatarId, value.favoriteId);
            favoriteAvatarContainer.classList.add("vrchat_plus_favorite_avatars_container");
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