<br>
<p align="center">
  <img src="better_vrc_dot_com/icon_128.png">
</p>
<p align="center" style="font-size:28px; margin: 2px;">Better vrchat DOT com</p>  
<p align="center">~ VRChat公式サイトをちょっと便利にするブラウザ拡張機能 ~</p>
<p align="center">
<a href="https://chrome.google.com/webstore/detail/better-vrchat-dot-com/joaffhoebddkohkafembmdkfmmcgmepj?hl=ja"><img alt="Chrome Web Store" src="https://img.shields.io/chrome-web-store/v/joaffhoebddkohkafembmdkfmmcgmepj?color=%2382c91e&style=for-the-badge"></a>
<a href="https://addons.mozilla.org/ja/firefox/addon/better-vrchat-dot-com/"><img style="margin-left:12px" alt="Mozilla Add-on" src="https://img.shields.io/amo/v/better-vrchat-dot-com?color=%23fd7e14&style=for-the-badge"></a>
</p>

* * *
![GitHub](https://img.shields.io/github/license/riku1227/Better-vrchat-DOT-com?style=flat-square)
> ※VRChat APIは公式にはサポートされておりません、そのため当拡張機能が利用できなくなったり、予想外の動作をするようになったり、ログインしているアカウントがBANされるなどの可能性が存在します。完全に自己責任でご使用ください  

# ✨ 機能一覧
* フレンドが居るインスタンスに居るユーザー数を更新するボタンを追加
  * 更新ボタンを押すことで、そのワールドの推奨キャパシティと最大キャパシティも表示されるようになります
* フレンドが居るインスタンに居るユーザー数を非表示にする機能
  * デフォルトでは無効化されているので、非表示にしたい場合は、設定で有効化してください
  * ユーザー数でどうしても怖じ気づいてしまい、入りにくくなってしまったと感じている方、ぜひ
* アバターの情報ページにある「Make Avatar Public」ボタン、「Delete Avatar」ボタンを非表示にする機能
  * それぞれ個別に表示/非表示設定できます
  * デフォルトでは無効化されているので、非表示にしたい場合は、設定で有効化してください
* それぞれの機能を設定で個別に有効化/無効化することができます

# 🧑‍💻 ダウンロード
### Chrome  
<a href="https://chrome.google.com/webstore/detail/better-vrchat-dot-com/joaffhoebddkohkafembmdkfmmcgmepj?hl=ja"><img alt="Chrome Web Store" src="https://img.shields.io/chrome-web-store/v/joaffhoebddkohkafembmdkfmmcgmepj?color=%2382c91e&style=for-the-badge"></a>  
### Firefox  
<a href="https://addons.mozilla.org/ja/firefox/addon/better-vrchat-dot-com/"><img alt="Mozilla Add-on" src="https://img.shields.io/amo/v/better-vrchat-dot-com?color=%23fd7e14&style=for-the-badge"></a>

# 🔒️ 安全性について
当拡張機能はID / パスワードの入力は必要ありません。  
VRChat APIを使用するため、Cookieに保存されているトークン(認証情報)をVRChatのサーバーに送信します。  
拡張機能自体は ID / パスワード / トークン などの認証情報を一切取得しておりません。  


# 📄 更新履歴
### 2.3.0
* 2024/08/08時点でのウェブサイトに対応
* 公式で実装されたため、インスタンスに居るユーザー数を表示する機能を削除
  * 更新ボタンは削除されていません
* [新機能] インスタンスに居るユーザー数を更新するボタンの動作を変更
  * ワールドの推奨キャパシティと最大キャパシティも表示されるようになりました
* [新機能] インスタンスに居るユーザー数を非表示にする機能を追加
  * デフォルトだと有効化されていません、設定から有効化してください
  * ユーザー数でどうしても怖じ気づいてしまい、入りにくくなってしまったと感じている方、ぜひ
* 設定画面のUIを再デザイン
  * 良い感じになったヨ
### 2.2.0
* 拡張機能の設定ページを追加
* ナビゲーションメニューに拡張機能の設定を開くボタンを追加
* アバターの情報を表示するページにある「Make Avatar Public」ボタンを非表示にする機能を追加
  * デフォルトでは無効化されているので、設定で有効化してください
* アバターの情報を表示するページにある「Delete Avatar」ボタンを非表示にする機能を追加
  * デフォルトでは無効化されているので、設定で有効化してください
### 2.1.0
* インスタンス内ユーザー表示機能の更新ボタンの見た目を修正
* コードをTypeScriptで書き直した
### 2.0.1 (Firefox限定)
* URLが「vrchat[.]com/home」の時動作しない不具合を修正
### 2.0.0
* 最新(2022/09/11現在)のウェブサイトに対応
* FAPシステムの機能を削除しました
* 公式に追加されたのでお気に入りアバターを表示する機能を削除
* アバターIDからお気に入り登録する機能を削除
  * 再実装する可能性はあり
* アバターをセットする機能を削除
  * 再実装する可能性はあり
### v1.3.0
* 拡張機能の名前を "VRChat+" から "Better vrchat DOT com" に変更
* Favorite Avatar Preset Systemの機能を削除/変更 
* お気に入りアバターをアバターIDから追加する時のエラーメッセージが正しく表示されるように
* アバターのお気に入りを解除するときのダイアログにそのアバターの名前を表示するように
### v1.2.0
* Favorite Avatar Preset Systemを追加
### v1.1.0
* INVITE MEボタンを追加
* インスタンスにいるユーザー数を更新するボタンを追加 
### v1.0.1
* ログを削除
### v1.0.0
* 初回リリース

# 👥 貢献者様～～～！  
<a href="https://github.com/riku1227/Better-vrchat-DOT-com/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=riku1227/Better-vrchat-DOT-com" />
</a>

Made with [contrib.rocks](https://contrib.rocks).