// ページが読み込まれたときの処理
window.onload = () => {
    setupSideMenu();

    /**
     * Friends Location Settings
     */
    const enableSearchPagePostageKey = "enable_location_card_instance_user_count";
    const searchPagePostageCheckbox = document.getElementById(enableSearchPagePostageKey) as HTMLInputElement;

    initializeCheckBox(searchPagePostageCheckbox, enableSearchPagePostageKey, true);

    /**
     * Avatar Detail Settings
     */
    const enableMakeAvatarPublicKey = "enable_hide_make_avatar_public_button";
    const makeAvatarPublicCheckbox = document.getElementById(enableMakeAvatarPublicKey) as HTMLInputElement;

    initializeCheckBox(makeAvatarPublicCheckbox, enableMakeAvatarPublicKey, false);

    const enableDeleteAvatarKey = "enable_hide_delete_avatar_button";
    const deleteAvatarCheckbox = document.getElementById(enableDeleteAvatarKey) as HTMLInputElement;

    initializeCheckBox(deleteAvatarCheckbox, enableDeleteAvatarKey, false);
};

/**
 * ストレージから設定の値を読み込んでセレクトボックスにセットし
 * 値が変更されたときにストレージに保存されている設定の値を更新するようにする
 * @param selectBox <select>の要素
 * @param storageKey 設定が保存されているキー
 * @param defaultValue 設定に保存されていなかった場合にセットされるデフォルトの値
 * @param initCallback 初期化時に追加で行う処理
 * @param callback セレクトボックスの値を変更したときに行う追加の処理
 */
const initializeSelectBox = (selectBox: HTMLSelectElement, storageKey: string, defaultValue: string, initCallback?: () => void, changeCallback?: () => void) => {
    chrome.storage.sync.get(storageKey).then((result) => {
        // セレクトボックスにセットする値
        let setValue = defaultValue;
        if (storageKey in result) {
            // 設定に保存されていた場合はその値をセット
            setValue = result[storageKey];
        } else {
            chrome.storage.sync.set({ [storageKey]: defaultValue });
        }

        initCallback?.();

        setValueToSelectBox(selectBox, setValue);
    });

    /**
     * セレクトボックスの値を変更したときの処理
     * ストレージの値を更新する
     */
    selectBox.addEventListener('change', (event) => {
        const value = (event.target as HTMLSelectElement).value;
        chrome.storage.sync.set({ [storageKey]: value }).then;
    });
}

/**
 * セレクトボックスに値をセットする
 * @param selectBox セレクトボックス
 * @param value セットする値
 */
const setValueToSelectBox = (selectBox: HTMLSelectElement, value: string) => {
    const options = selectBox.options;
    for (let i = 0; i < options.length; i++) {
        const option = options[i];
        if (option.value == value) {
            option.selected = true;
            break;
        }
    }
}

/**
 * ストレージから設定の値を読み込んでチェックボックスにセットし
 * 値が変更されたときにストレージに保存されている設定の値を更新するようにする
 * @param checkbox チェックボックスの要素
 * @param storageKey ストレージキー
 * @param defaultValue デフォルトの値
 */
const initializeCheckBox = (checkbox: HTMLInputElement, storageKey: string, defaultValue: boolean) => {
    chrome.storage.sync.get(storageKey).then((result) => {
        let setValue = defaultValue;
        if (storageKey in result) {
            // 設定に保存されていた場合はその値をセット
            setValue = result[storageKey];
        } else {
            chrome.storage.sync.set({ [storageKey]: defaultValue });
        }

        checkbox.checked = setValue;
    });
    
    checkbox.addEventListener('change', (event) => {
        const value = (event.target as HTMLInputElement).checked;
        chrome.storage.sync.set({ [storageKey]: value }).then();
    });
}

const setupSideMenu = () => {
    // メニュー項目を全て取得
    var menuItems = document.querySelectorAll('#menu li');
    // 各メニュー項目に対して処理を行う
    menuItems.forEach((menuItem) => {
        // メニュー項目がクリックされたときの処理
        menuItem.addEventListener('click', function (this: HTMLLIElement) {
            // 右側のコンテンツ領域を全て取得
            var contents = document.querySelectorAll('.right-container > div');
            const contentStr = this.dataset.content;
            if (contentStr == undefined) {
                return;
            }
            const clickContent = document.getElementById(contentStr);
            
            /**
             * 一度全てのコンテンツを非表示にしてから
             * 対象のコンテンツを表示させる
             * 
             * またフェードイン、フェードアウトのアニメーション用に、クラスを付与してから一定時間経過後に非表示処理をしたりする
             */
            new Promise<void>((resolve) => {
                // 一度全てのコンテンツを非表示にする
                contents.forEach((content) => {
                    const element = content as HTMLElement;
                    if (element.style.display == 'block') {
                        element.classList.add('fade-out');
                    }

                    // アニメーション再生の猶予時間
                    setTimeout(() => {
                        resolve();
                    }, 100);
                });
            }).then(() => {
                contents.forEach((content) => {
                    const element = content as HTMLElement;
                    element.style.display = 'none';
                    element.classList.remove('fade-out');

                    // HTML側で設定されているが"all"の場合、全てのコンテンツを表示する
                    if(contentStr == "all") {
                        element.style.display = 'block';
                        element.classList.add('fade-in');
                        setTimeout(() => {
                            element.classList.remove('fade-in');
                        }, 100);
                    } else {
                        if(clickContent) {
                            clickContent.style.display = 'block';
                            clickContent.classList.add('fade-in');
                            setTimeout(() => {
                                clickContent.classList.remove('fade-in');
                            }, 100);
                        }
                    }
                })
            });

            // クリックされたメニュー項目に 'side-menu_selected' クラスを追加
            this.classList.add('side-menu_selected');
            // 他のメニュー項目から 'side-menu_selected' クラスを削除
            menuItems.forEach((item) => {
                if (item !== this) {
                    item.classList.remove('side-menu_selected');
                }
            });
        });
    });
}