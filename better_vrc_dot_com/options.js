(() => {

    /**
    * 'translate'クラスを持つDOM要素のテキストコンテンツを翻訳します。
    *
    * @return {undefined} この関数は値を返しません。
    */
    const translateDOMElementTextContent = () => {
        const elements = document.getElementsByClassName('translate');
        for (let i = 0; i < elements.length; i++) {
          const element = elements[i];
          const textContent = element.textContent;
          const translatedText = chrome.i18n.getMessage(textContent);
      
          element.textContent = translatedText;
        }
      }

    /**
    * チェックボックスの初期化
    * @param {HTMLInputElement} checkbox - チェックボックス要素
    * @param {string} storageKey - ストレージキー
    * @param {boolean} defaultValue - デフォルト値
    */
    const initializeCheckbox = (checkbox, storageKey, defaultValue) => {
        chrome.storage.sync.get(storageKey).then((result) => {
            if (storageKey in result) {
                checkbox.checked = result[storageKey];
            } else {
                checkbox.checked = defaultValue;
                chrome.storage.sync.set({ [storageKey]: defaultValue });
            }
        });
    }

    /**
     * チェックボックスの値を更新
     * @param {HTMLInputElement} checkbox - チェックボックス要素
     * @param {string} storageKey - ストレージキー
     */
    const updateCheckboxValue = (checkbox, storageKey) => {
        chrome.storage.sync.set({ [storageKey]: checkbox.checked });
    }

    // テキストをchrome.i18で取得した文字列に変更する
    translateDOMElementTextContent();
    /**
     * ------------------------------
     * Better Location Card 関連の設定
     * ------------------------------
     */

    /**
     * インスタンスに居る人数を表示する機能の有効/無効設定
     */
    const betterLocationCardCheckbox = document.getElementById("better_location_card_enable_instance_user_count");
    const betterLocationCardStorageKey = "enable_location_card_instance_user_count";

    initializeCheckbox(betterLocationCardCheckbox, betterLocationCardStorageKey, true);

    betterLocationCardCheckbox.addEventListener("change", () => {
        updateCheckboxValue(betterLocationCardCheckbox, betterLocationCardStorageKey);
    });


    /**
     * ------------------------------
     * アバター情報ページの設定
     * ------------------------------
     */

    /**
     * 「Make Avatar Public」ボタンを非表示にする機能の有効/無効設定
     */
    const enableHideMakeAvatarPublicButton = document.getElementById("avatar_details_enable_hide_make_avatar_public_button");
    const enableHideMakeAvatarPublicButtonStorageKey = "enable_hide_make_avatar_public_button";

    initializeCheckbox(enableHideMakeAvatarPublicButton, enableHideMakeAvatarPublicButtonStorageKey, false);

    enableHideMakeAvatarPublicButton.addEventListener("change", () => {
        updateCheckboxValue(enableHideMakeAvatarPublicButton, enableHideMakeAvatarPublicButtonStorageKey);
    });

    /**
     * 「Delete Avatar」ボタンを非表示にする機能の有効/無効設定
     */
    const enableHideDeleteAvatarButton = document.getElementById("avatar_details_enable_hide_delete_avatar_button");
    const enableHideDeleteAvatarButtonStorageKey = "enable_hide_delete_avatar_button";

    initializeCheckbox(enableHideDeleteAvatarButton, enableHideDeleteAvatarButtonStorageKey, false);

    enableHideDeleteAvatarButton.addEventListener("change", () => {
        updateCheckboxValue(enableHideDeleteAvatarButton, enableHideDeleteAvatarButtonStorageKey);
    })
})();
