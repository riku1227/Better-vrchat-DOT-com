/**
 * アバターの情報を表示するページを良い感じに扱えるようにするクラス
 */
export class VRCAvatarDetailsPage {
    content: HTMLDivElement;

    constructor(homeContent: HTMLDivElement) {
        /**
         * div: home-content
         *   div: container ← これを取っておく
         *     ...: ここに色々と情報の要素がある     
         *  */ 
        this.content = homeContent.children[0] as HTMLDivElement;
    }

    // アバターのサムネ/名前/アップロードしたユーザー名 などが表示されるコンテナ
    get avatarInformationContainer(): HTMLDivElement {
        return this.content.children[0] as HTMLDivElement;
    }

    // "Options", "Details", "Add to Favorites" があるコンテナ
    get avatarOthersContainer(): HTMLDivElement {
        return this.content.children[1] as HTMLDivElement;
    }

    /**
     * アバターのオプションカード
     *   | - "Make Avatar Public", "Switch to Avatar" とかあるカード
     */
    get avatarOptionsCard(): HTMLDivElement {
        return this.avatarOthersContainer.children[0] as HTMLDivElement;
    }

    /**
     * アバターの詳細カード
     *   | - "Details", "Add to Favorites"
     */
    get avatarDetailsContainer(): HTMLDivElement {
        return this.avatarOthersContainer.children[1] as HTMLDivElement;
    }

    /**
     * アバターオプションのボタンが入っているコンテナ
     */
    get avatarOptionsButtonContainer(): HTMLDivElement {
        /**
         * div: Avatar Options Card
         *   div: Title
         *   div: Button's Div
         *     div
         *       div
         *         div: ← これを取得する
         */
        return this.avatarOptionsCard.children[1].children[0].children[0].children[0] as HTMLDivElement;
    }

    get makeAvatarPublicButton(): HTMLButtonElement | null | undefined {
        const buttonsContainer = this.avatarOptionsButtonContainer;

        // ボタンが入っているコンテナに二個以上の要素があった場合は、「Make Avatar Public」ボタンが存在する
        if(buttonsContainer.children.length >= 2) {
            return buttonsContainer.children[0].children[0] as HTMLButtonElement;
        } else {
            return null;
        }
    }

    get optionsButtonSpace(): HTMLHRElement | null | undefined {
        const buttonsContainer = this.avatarOptionsButtonContainer;

        // ボタンが入っているコンテナに二個以上の要素があった場合は、Switch AvatarとDelete Avatarの間のスペースが存在する
        if(buttonsContainer.children.length >= 2) {
            return buttonsContainer.children[2] as HTMLHRElement;
        } else {
            return null;
        }
    }

    get deleteAvatarButton(): HTMLButtonElement | null | undefined {
        const buttonsContainer = this.avatarOptionsButtonContainer;

        // ボタンが入っているコンテナに二個以上の要素があった場合は、「Delete Avatar」ボタンが存在する
        if(buttonsContainer.children.length >= 2) {
            return buttonsContainer.children[3].children[0] as HTMLButtonElement;
        } else {
            return null;
        }
    }
}