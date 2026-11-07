---
title: クローンアプリを作ってみたーNetflixクローン②
tags:
  - Next.js
  - prisma
private: false
updated_at: '2024-06-29T14:49:51+09:00'
id: 4dd10edb45d0febd2d77
organization_url_name: potato-salad
slide: false
ignorePublish: false
posting_campaign_uuid: 16baee61b1d8bd4aac5a
agreed_posting_campaign_term: true
---
# はじめに
初めまして！
エンジニアになって数年、今まで本を読むだけでしたが、もっとプライベートで楽しみながら成長したい！自分が学んだ足跡を残していきたい！と思い記事を書きました！
最終的には自在に開発できるようになりたいと思っています。:triumph:
いろいろな記事を参考にさせてもらっています。:bow_tone2:
その中でもこれってどういう意味？とかつまづいたところを念入りに書いていこうかと思います。:fist:

# 今回の目的
nextjsはまだですが、実際のアプリ開発からどう作られていくかを学んでいくためにクローンアプリを開発します。
とは言っても自分で考えることは特になくYoutubeを見てやっていきます。
その中で覚えておきたい部分を分類ごとに記載していきます。なので、その時々に知ったことを小出しにしていく形になります。

前回

https://qiita.com/mr_noppo/items/9ddbe9ca6b69b8c1829f

# 使用したものや事前準備
・Macbook Pro
・Visual Studio Code

# 使用にさせていただいた動画

https://www.youtube.com/watch?v=mqUN4N2q4qY&t=4201s

# Next.jsの知識
### 更新用関数
set関数内でpropsを受け取るようにすれば現在のstate値を受け取れる（スナップされた値ではない）
```tsx
setVariant((currentVariant) => currentVariant === "login" ? "register" : "login")
```
# Prismaの知識
### 拡張機能
Prismaでinstall、コード補完、書式設定、定義へのジャンプなど。

### 設定
#### npm install -D prisma
インストール

#### npx prisma init
prismaフォルダ生成,providerは好きなものに変更
![スクリーンショット 2024-06-29 12.32.43.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/943982/7594c991-c388-7ffa-34e4-635f13f85896.png)

#### npm install @prisma/client
データベースに対するクエリを簡単かつ効率的に実行するための自動生成される型安全なクエリビルダー

#### gloval.d.ts
globalオブジェクトを使ってアプリケーション全体で共有される変数を保持することができる。
追加するには下記
```ts
declare global {
  namespace globalThis {
    var prismadb: PrismaClient
  }
}
```
#### Atlas
MongoDBのデータベースをクラウドでホストするためのフルマネージドサービス
無料プランでプロジェクト（スキーマ？）を一つ作れる。
ソースコードからの接続方法は「Connect」ボタンを押してVsCodeの項目参照
![スクリーンショット 2024-06-29 14.33.36.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/943982/0d4b12e4-eb33-c616-3fd3-c531b45cbc15.png)
URIの末尾にデータベース名を追加すること。下記のエラーが出る
![スクリーンショット 2024-06-29 14.35.07.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/943982/cc101de8-0009-a188-4f9d-5d7d726ea55d.png)

#### schema.prisma
modelはテーブル定義が作れる

#### ＠＠unique([provider, providerAccountId])
provider と providerAccountId の組み合わせが一意であることを保証する。

#### id String ＠id ＠default(auto()) ＠map("_id") ＠db.ObjectId
一意であり、デフォルトでObjectIdを自動生成。
mongoDBの実際のカラム名は_idで、idで紐付けている。

#### ＠updatedAt
レコードの更新時に自動で値を現在日時に更新

#### user User ＠relation(fields: [userId], references: [id], onDelete: Cascade)
userIdとUesrモデルのidを紐づける。Userモデルの関連するレコードが消えた場合、紐づいているuserIdレコードが削除される

#### npx prisma db push
Databaseにmodel情報をpush

# 次
まだ
