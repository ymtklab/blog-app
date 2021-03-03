# ささいなブログ
ユーザー登録・ログインをすることで利用することができるブログです。

URL: 

# 機能一覧
- ユーザー登録・ログイン/ログアウトができる
- ブログ記事を投稿できる
- ブログ記事を編集・削除できる
- ブログにコメントを書くことができる
- コメントを削除することができる
- 管理者はすべての記事・コメントを削除できる

# 利用技術
　バックエンドの言語には **Node.js** 、フレームワークは **express** を利用しました。アプリケーションは**Heroku**にデプロイし、データベースはHerokuの**postgresql**アドオンを使いました。データベースの処理は、**sequlize** というNode.jsのORMを用いました。ログイン機能はexpress-sessionというライブラリを使い、ユーザー情報をセッションに保持することで実現しました。
 　ページの描画は **pug** テンプレートを使い、CSS は基本的にBootstrapで実装しました。
