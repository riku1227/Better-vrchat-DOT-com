class BetterAvatars {
    static favoriteAvatarsMap = new Map();

    static classSetAvatarButton = "better_vrc_set_avatar_button";
    static classCopyAvatarIDButton = "better_vrc_copy_avatar_id_button";
    static classFavoriteAvatarsCollapse = "better_vrc_favorite_avatars_collapse";
    static idAddFavoriteInputForm = "better_vrc_add_favorite_input_form";

    static avatarIdRegex = /avtr_[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}/

    static getAvatarRightContainer(avatarContainer) {
        return avatarContainer.getElementsByClassName("col-md-8")[0];
    }

    static addSetAvatarButton(avatarContainer) {
        const avatarRightContainer = this.getAvatarRightContainer(avatarContainer);
        const buttonDOM = VRCDOM.createButton("Set Avatar", ["fas", "fa-user-tie"], "Set Avatar");
        buttonDOM.classList.add(this.classSetAvatarButton);

        buttonDOM.addEventListener("click", () => {
            const avatarId = VRCUtil.removeVRChatDotComURL(
                avatarRightContainer.getElementsByTagName("h4")[0].firstChild.href
            ).replace("avatar/", "");

            VRChatAPI.putSetAvatar(avatarId);
        });

        avatarRightContainer.appendChild(buttonDOM);
    }

    static addCopyAvatarIDButton(avatarContainer) {
        const avatarRightContainer = this.getAvatarRightContainer(avatarContainer);
        const buttonDOM = VRCDOM.createButton("Copy Avatar ID", ["far", "fa-copy"], "Copy Avatar ID");
        buttonDOM.classList.add(this.classCopyAvatarIDButton);

        const setAvatarButton = avatarRightContainer.getElementsByClassName(this.classSetAvatarButton)[0];
        if(setAvatarButton) {
            buttonDOM.style.marginLeft = "8px";
        }

        buttonDOM.addEventListener("click", () => {
            const avatarId = VRCUtil.removeVRChatDotComURL(
                avatarRightContainer.getElementsByTagName("h4")[0].firstChild.href
            ).replace("avatar/", "");
            navigator.clipboard.writeText(avatarId);
        });

        avatarRightContainer.appendChild(buttonDOM);
    }

    static addUnFavoriteAvatarButton(avatarContainer, favoriteId) {
        const avatarRightContainer = this.getAvatarRightContainer(avatarContainer);
        const avatarName = avatarRightContainer.getElementsByTagName("h4")[0].textContent;
        const buttonDOM = VRCDOM.createButton("Unfav Avatar", ["fas", "fa-user-minus"]);

        buttonDOM.addEventListener("click", () => {
            if (window.confirm(`アバター 「${avatarName}」 のお気に入り登録を解除しますか？\n\nUnfavorite this( ${avatarName} ) avatar?`)) {
                VRChatAPI.deleteFavorite(favoriteId).then((request) => {
                    avatarContainer.remove();
                });
            }
        });

        const setAvatarButton = avatarRightContainer.getElementsByClassName(this.classSetAvatarButton)[0];
        const copyAvatarIdButton = avatarRightContainer.getElementsByClassName(this.classCopyAvatarIDButton)[0];

        if(setAvatarButton || copyAvatarIdButton) {
            buttonDOM.style.marginLeft = "8px";
        }

        avatarRightContainer.appendChild(buttonDOM);
    }

    static addFavoriteAvatarContainer(favoriteAvatar, listDiv) {
        if(!favoriteAvatar) {
            return;
        }
        const avatarContainer = VRCDOM.createAvatarContainer(favoriteAvatar.name, favoriteAvatar.description, favoriteAvatar.thumbUrl, favoriteAvatar.avatarId);
        this.addSetAvatarButton(avatarContainer);
        this.addCopyAvatarIDButton(avatarContainer);
        this.addUnFavoriteAvatarButton(avatarContainer, favoriteAvatar.favoriteId);
        listDiv.appendChild(avatarContainer);
    }

    static addFavoriteTextInput(listDiv) {

        //お気に入りアバターコンテナの前にある要素
        let avatarContainerPrevElement = null;

        const addFavoriteTitle = DOM.createElement("h4");
        addFavoriteTitle.textContent = "アバターをお気に入り登録する"
        addFavoriteTitle.style.marginLeft = "16px";
        addFavoriteTitle.style.marginBottom = "0px";
        listDiv.appendChild(addFavoriteTitle);

        const addFavoriteAvatarForm = VRCDOM.createTextInputForm(this.idAddFavoriteInputForm, "Avatar ID", ["fas", "fa-plus"]);
        addFavoriteAvatarForm.parent.style.margin = "16px";
        listDiv.appendChild(addFavoriteAvatarForm.parent);

        const messageP = DOM.createP();
        messageP.style.marginLeft = "16px";
        messageP.style.whiteSpace = "pre-wrap";
        listDiv.appendChild(messageP);

        avatarContainerPrevElement = messageP;

        addFavoriteAvatarForm.button.addEventListener("click", () => {
            const formValue = addFavoriteAvatarForm.input.value;
            if(!this.avatarIdRegex.test(formValue)) {
                messageP.textContent = `${Util.getTimeOnLogFormat()} 正しいアバターIDを入力してください`;
                return;
            }

            VRChatAPI.addFavoriteAvatar(formValue, "avatars1").then((request) => {
                let resultMessage = "";
                let resultStatusCode = request.status;
                let favoriteId = "";

                switch(resultStatusCode) {
                    case 200:
                        resultMessage = "アバターをお気に入りに追加しました";
                        addFavoriteAvatarForm.input.value = "";

                        const favoriteObject = JSON.parse(request.response);
                        favoriteId = favoriteObject.id;
                    break;
                    case 404:
                        resultMessage = "入力されたアバターIDのアバターが見つかりません";
                    break;
                    case 400:
                        const errorJson = JSON.parse(request.response);
                        switch(errorJson.error.message) {
                            case "You already have 25 favorite avatars in group 'avatars1'":
                                resultMessage = `"avatars1" グループには既に25アバターが登録されています`;
                            break;
                            case "You already have that avatar favorited":
                                resultMessage = `既にそのアバターはお気に入りに登録されています`;
                            break;
                            default:
                                resultMessage = `原因不明のエラーが発生しました\n[Status Code: ${request.status}]: ${request.response}`;
                        }
                    break;
                    default:
                        resultMessage = `原因不明のエラーが発生しました\n[Status Code: ${request.status}]: ${request.response}`;
                }

                messageP.textContent = `${Util.getTimeOnLogFormat()}: ${resultMessage}`;

                if(resultStatusCode == 200) {
                    VRChatAPI.getAvatar(formValue).then((request) => {
                        if(request == undefined) {
                            return;
                        }

                        const avatarObject = JSON.parse(request.response);
                        const avatarContainer = VRCDOM.createAvatarContainer(avatarObject.name, avatarObject.description, avatarObject.thumbnailImageUrl, avatarObject.id);
                        this.addSetAvatarButton(avatarContainer);
                        this.addCopyAvatarIDButton(avatarContainer);
                        this.addUnFavoriteAvatarButton(avatarContainer, favoriteId);

                        listDiv.insertBefore(avatarContainer, avatarContainerPrevElement.nextSibling);
                    });
                }
            });
        });
    }

    //FAPSystemコンテキストで実行されるからthisではなくBetterAvatarsって書く
    //なんだこのクソコード
    static addFAPAvatarContainer(fapAvatars, fapContainer) {
        const continerDivID = "fap_avatar_container_div"

        const oldContainer = DOM.getById(continerDivID);
        if(oldContainer) {
            oldContainer.remove();
        }
        
        const containerDiv = DOM.createDiv();
        containerDiv.style.width = "100%";
        containerDiv.id = continerDivID;
        for(let i = 0; i < fapAvatars.length; i++) {
            const fapAvatar = fapAvatars[i];
            const fapAvatarContainer = VRCDOM.createAvatarContainerWithAvatarObject(fapAvatar);

            BetterAvatars.addSetAvatarButton(fapAvatarContainer);
            BetterAvatars.addCopyAvatarIDButton(fapAvatarContainer);
            containerDiv.appendChild(fapAvatarContainer);
        }
        fapContainer.list.appendChild(containerDiv);
    }

    static setupPrivateContainer() {
        const privateContainers = DOM.getByClass("private");
        for(let i = 0; i < privateContainers.length; i++) {
            const privateContainer = privateContainers[i];
            privateContainer.classList.remove("private");

            this.addSetAvatarButton(privateContainer);
            this.addCopyAvatarIDButton(privateContainer);
        }
    }

    static setupFavoriteAvatars() {
        if(!DOM.getByClass(this.classFavoriteAvatarsCollapse)[0]) {
            const homeContent = DOM.getByClass("home-content")[0];
            const col12 = homeContent.getElementsByClassName("col-12")[0];

            const favoriteAvatarsCollapse = VRCDOM.createCollapseRowList("Favorite Avatars");
            favoriteAvatarsCollapse.parent.style.display = "none";
            favoriteAvatarsCollapse.parent.classList.add(this.classFavoriteAvatarsCollapse);
            col12.appendChild(favoriteAvatarsCollapse.parent);

            this.addFavoriteTextInput(favoriteAvatarsCollapse.list);

            if(this.favoriteAvatarsMap.size <= 0) {
                VRChatAPI.getFavoriteAvatarIDs("avatars1").then((request) => {
                    const favoriteIds = JSON.parse(request.response);
                    for(let i = 0; i < favoriteIds.length; i++) {
                        const favoriteObject = favoriteIds[i];
                        this.favoriteAvatarsMap.set(favoriteObject.favoriteId, 
                            {
                                avatarId: favoriteObject.favoriteId,
                                favoriteId: favoriteObject.id
                            });
                    }
    
                    return VRChatAPI.getFavoriteAvatars("avatars1");
                }).then((request) => {
                    const favoriteAvatars = JSON.parse(request.response);
                    for(let i = 0; i < favoriteAvatars.length; i++) {
                        const avatar = favoriteAvatars[i];
                        const mapAvatarObject = this.favoriteAvatarsMap.get(avatar.id);
                        if(mapAvatarObject) {
                            mapAvatarObject.name = avatar.name;
                            mapAvatarObject.description = avatar.description;
                            mapAvatarObject.thumbUrl = avatar.thumbnailImageUrl;
    
                            this.favoriteAvatarsMap.set(mapAvatarObject);
                        }
                    }
    
                    this.favoriteAvatarsMap.forEach((value, key) => {
                        this.addFavoriteAvatarContainer(value, favoriteAvatarsCollapse.list);
                    });
    
                    favoriteAvatarsCollapse.parent.style.display = "block";
                });
            } else {
                this.favoriteAvatarsMap.forEach((value, key) => {
                    this.addFavoriteAvatarContainer(value, favoriteAvatarsCollapse.list);
                });

                favoriteAvatarsCollapse.parent.style.display = "block";
            }

            const fapSystem = new FAPSystem(col12, this.addFAPAvatarContainer);
            fapSystem.setupFAPContainer();
        }
    }

    static setupBetterAvatars() {
        if(IntervalIDS.avatarsInterval == 0) {
            const intervalAvatar = () => {
                this.setupPrivateContainer();
            }

            IntervalIDS.avatarsInterval = setInterval(intervalAvatar, 1500);
        }

        this.setupFavoriteAvatars();
    }
}