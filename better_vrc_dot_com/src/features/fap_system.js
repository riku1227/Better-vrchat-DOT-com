class FAPSystem {
    static classFAPContainer = "better_vrc_fap_container";

    constructor(avatarsCol12, loadFAPCallback) {
        this.avatarsCol12 = avatarsCol12;
        this.loadFAPCallback = loadFAPCallback;
    }

    loadFAP(files) {
        if(files.length == 0) {
            return;
        }

        return new Promise (() => {
            Util.readFileAsText(files[0]).then((result) => {
                try {
                    const fapObject = JSON.parse(result);
    
                    if (fapObject.presetName == undefined || fapObject.avatars.length == 0) {
                        alert("選択されたファイルはFAP形式ではないか、アバターリストの中が空です");
                    } else {
                        if (window.confirm(`お気に入りアバタープリセット 「${fapObject.presetName}」 をロードしますか？`)) {
                            const promiseArray = [];
                            fapObject.avatars.forEach((value) => {
                                promiseArray.push(VRChatAPI.getAvatar(value));
                            });
                            return Promise.all(promiseArray);
                        }
                    }
                } catch(e) {
                    alert("選択されたファイルはJSON形式ではありません")
                }
            }).then((requests) => {
                if(requests == undefined) {
                    return;
                }
                const fapAvatars = [];
                for(let i = 0; i < requests.length; i++) {
                    const request = requests[i];
                    if(request.status == 200) {
                        const avatarObject = JSON.parse(request.response);
                        fapAvatars.push(avatarObject);
                    }
                }

                this.loadFAPCallback(fapAvatars, this.fapContainer);
            });
        });
    }

    addInputFileForm () {
        const list = this.fapContainer.list;
        
        const fapLink = DOM.createA();
        fapLink.textContent = "FAPSystemの機能が削除/変更された理由";
        fapLink.href = "https://github.com/riku1227/Better-vrchat-DOT-com/blob/files/fapsystem.md";
        fapLink.style.marginLeft = "16px"
        list.appendChild(fapLink);

        const explanationText = DOM.createP();
        explanationText.textContent = `FAPファイルを読み込んでプリセットに登録されているアバター一覧を表示することができます。`;
        explanationText.style.marginLeft = "16px";
        list.appendChild(explanationText);

        const inputForm = DOM.createElement("input");
        inputForm.type = "file";
        inputForm.style.marginLeft = "16px";
        list.appendChild(inputForm);

        const loadButton = VRCDOM.createButton("Load FAP");
        list.appendChild(loadButton);

        loadButton.addEventListener("click", () => {
            this.loadFAP(inputForm.files, list)
        });
    }

    setupFAPContainer() {
        if(!DOM.getByClass(this.classFAPContainer)[0]) {
            this.fapContainer = VRCDOM.createCollapseRowList("Favorite Avatar Preset (一部機能のみ使用可能)");
            this.avatarsCol12.appendChild(this.fapContainer.parent);

            this.addInputFileForm();
        }
    }

    getFapContainer() {
        return this.fapContainer;
    }
}