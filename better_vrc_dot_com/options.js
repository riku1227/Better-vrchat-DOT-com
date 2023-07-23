(() => {
    /**
     * ------------------------------
     * Better Location Card 関連の設定
      *------------------------------
     */

    /**
     * インスタンスに居る人数を表示する機能の有効/無効設定
     */
    // チェックボックスエレメント
    const betterLocationCardCheckbox = document.getElementById("better_location_card_enable_instance_user_count");
    // ストレージに収納している設定値のキー
    const betterLocationCardStorageKey = "enable_location_card_instance_user_count";

    // 設定値を取得する
    chrome.storage.sync.get(betterLocationCardStorageKey).then((result) => {
        /**
         * 設定値が存在していた場合はその設定値をチェックボックスに入れる
         * 存在しなかった場合はデフォルトの値をチェックボックスに入れ、ストレージにデフォルトの値を保存する
         */
        if(betterLocationCardStorageKey in result) {
            betterLocationCardCheckbox.checked = result[betterLocationCardStorageKey];
        } else {
            betterLocationCardCheckbox.checked = true;
            chrome.storage.sync.set(
                {
                    [betterLocationCardStorageKey] : true
                }
            );
        }
    });

    // チェックボックスの値が変更された場合、その値をストレージに保存する
    betterLocationCardCheckbox.addEventListener("change", () => {
        chrome.storage.sync.set(
            {
                [betterLocationCardStorageKey] : betterLocationCardCheckbox.checked
            }
        )
    });


    /**
     * ------------------------------
     * アバター情報ページの設定
      *------------------------------
     */

    /**
    * 「Make Avatar Public」ボタンを非表示にする機能の有効/無効設定
    */
    // チェックボックスエレメント
    const enableHideMakeAvatarPublicButton = document.getElementById("avatar_details_enable_hide_make_avatar_public_button");
    // ストレージに収納している設定値のキー
    const enableHideMakeAvatarPublicButtonStorageKey = "enable_hide_make_avatar_public_button";

    // 設定値を取得する
    chrome.storage.sync.get(enableHideMakeAvatarPublicButtonStorageKey).then((result) => {
        /**
         * 設定値が存在していた場合はその設定値をチェックボックスに入れる
         * 存在しなかった場合はデフォルトの値をチェックボックスに入れ、ストレージにデフォルトの値を保存する
         */
        if(enableHideMakeAvatarPublicButtonStorageKey in result) {
            enableHideMakeAvatarPublicButton.checked = result[enableHideMakeAvatarPublicButtonStorageKey];
        } else {
            enableHideMakeAvatarPublicButton.checked = false;
            chrome.storage.sync.set(
                {
                    [enableHideMakeAvatarPublicButtonStorageKey] : false
                }
            );
        }
    });

    // チェックボックスの値が変更された場合、その値をストレージに保存する
    enableHideMakeAvatarPublicButton.addEventListener("change", () => {
        chrome.storage.sync.set(
            {
                [enableHideMakeAvatarPublicButtonStorageKey] : enableHideMakeAvatarPublicButton.checked
            }
        )
    })
})();