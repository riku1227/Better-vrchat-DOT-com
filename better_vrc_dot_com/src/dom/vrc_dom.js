class VRCDOM {
    static createIconSpan(iconClassList, title) {
        const iconSpan = DOM.createSpan();
        DOM.addClassList(iconSpan, iconClassList);
        iconSpan.title = title;

        return iconSpan;
    }

    static createIconBadge(classNameList, textContent, title) {
        const parentSpan = DOM.createSpan();
        DOM.addClassList(parentSpan, ["badge", "badge-secondary"]);

        parentSpan.textContent = `${textContent} `;

        const iconSpan = this.createIconSpan(classNameList, title);

        parentSpan.appendChild(iconSpan);

        return parentSpan;
    }

    static createSpaceSpan () {
        const spaceSpan = DOM.createSpan();
        spaceSpan.style.width = "20px";
        spaceSpan.style.height = "20px";
        spaceSpan.textContent = " ";
        return spaceSpan;
    }

    static createButton(buttonText, buttonIconClassList, iconSpanTitle) {
        const buttonDOM = DOM.createButton();
        DOM.addClassList(buttonDOM, ["btn", "btn-secondary"])
        buttonDOM.type = "button";

        buttonDOM.textContent = buttonText;

        if(buttonIconClassList) {
            if(buttonIconClassList.length > 0) {
                const buttonIconSpan = this.createIconSpan(buttonIconClassList, iconSpanTitle);
                if(buttonText) {
                    buttonIconSpan.style.marginRight = "8px";
                }
    
                buttonDOM.insertBefore(buttonIconSpan, buttonDOM.firstChild);
            }
        }

        return buttonDOM;
    }

    static createCollapseRowList(title) {
        const parentDiv = DOM.createDiv();
        const parentH3 = DOM.createElement("h3");
        const collapseButton = this.createButton("", ["fa", "fa-plus-circle"]);
        collapseButton.style.marginRight = "8px";

        parentH3.textContent = title;
        parentH3.insertBefore(collapseButton, parentH3.firstChild);

        const collapseDiv = DOM.createDiv();
        collapseDiv.classList.add("collapse");

        const listDiv = DOM.createDiv();
        listDiv.classList.add("row");

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
    }

    static createAvatarContainer(avatarName, avatarDescription, avatarThumbnailUrl, avatarId) {
        const parentDiv = DOM.createDiv();
        DOM.addClassList(parentDiv, ["css-bj8sxz", "col-12"]);
        
        const searchContainer = DOM.createDiv();
        searchContainer.classList.add("search-container");
        parentDiv.appendChild(searchContainer);

        const rowDiv = DOM.createDiv();
        rowDiv.classList.add("row");
        searchContainer.appendChild(rowDiv);

        /**
         * アバターコンテナの左側(アバター画像など)
         */
        const colLeftContainer = DOM.createDiv();
        DOM.addClassList(colLeftContainer, ["col-12", "col-md-4"]);
        rowDiv.appendChild(colLeftContainer);

        const avatarThumbATag = DOM.createA();
        avatarThumbATag.href = `/home/avatar/${avatarId}`;
        colLeftContainer.appendChild(avatarThumbATag);

        const avatarThumbImg = DOM.createImg();
        avatarThumbImg.classList.add("w-100");
        avatarThumbImg.src = avatarThumbnailUrl;
        avatarThumbImg.title = avatarName;
        avatarThumbATag.appendChild(avatarThumbImg);

        /**
         * アバターコンテナの右側(名前や説明など)
         */
        const colRightContainer = DOM.createDiv();
        DOM.addClassList(colRightContainer, ["col-12", "col-md-8"]);
        rowDiv.appendChild(colRightContainer);

        const avatarTitleH4 = DOM.createElement("h4");
        colRightContainer.appendChild(avatarTitleH4);

        const avatarTitleA = DOM.createA();
        avatarTitleA.href = `/home/avatar/${avatarId}`;
        avatarTitleA.textContent = avatarName;
        avatarTitleH4.appendChild(avatarTitleA);

        if(avatarDescription) {
            const avatarDescriptionP = DOM.createP();
            avatarDescriptionP.textContent = avatarDescription;
            colRightContainer.appendChild(avatarDescriptionP);
        }

        return parentDiv;
    }

    static createTextInputForm(inputId, placeholder, buttonIconClassList) {
        const parentDiv = DOM.createDiv();
        parentDiv.classList.add("input-group");

        const textInput = DOM.createElement("input");
        textInput.type = "text";
        textInput.classList.add("form-control");
        textInput.placeholder = placeholder;
        textInput.id = inputId;
        parentDiv.appendChild(textInput);

        const appendSpan = DOM.createSpan();
        appendSpan.classList.add("input-group-append");

        let buttonDOM = null;
        if(buttonIconClassList || buttonIconClassList.length > 0) {
            buttonDOM = this.createButton("", buttonIconClassList, placeholder);
            buttonDOM.classList.remove("btn-secondary");
            buttonDOM.classList.add("btn-outline-secondary");

            appendSpan.appendChild(buttonDOM);
        }

        parentDiv.appendChild(appendSpan);

        return {
            parent: parentDiv,
            button: buttonDOM,
            input: textInput
        };
    }
}