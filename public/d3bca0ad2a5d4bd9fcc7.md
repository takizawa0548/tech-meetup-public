---
title: Volta導入（Macbook Pro）
tags:
  - Mac
  - Node.js
  - homebrew
  - npm
  - volta
private: false
updated_at: '2024-02-23T12:18:32+09:00'
id: d3bca0ad2a5d4bd9fcc7
organization_url_name: null
slide: false
ignorePublish: false
posting_campaign_uuid: null
agreed_posting_campaign_term: false
---
# はじめに
初めまして！
エンジニアになって数年、今まで本を読むだけでしたが、もっとプライベートで楽しみながら成長したい！自分が学んだ足跡を残していきたい！と思い記事をかきました！
最終的には自在に開発できるようになりたいと思っています。:triumph:
いろいろな記事を参考にさせてもらっています。:bow_tone2:
その中でもこれってどういう意味？とかつまづいたところを念入りに書いていこうかと思います。:fist:

# 今回の目的
前回の続きです！あれ、nodebrew入れて終わりじゃないの？と思われるかもしれませんが、Voltaの方が良さそうなのでそちらに移行してみます！

https://qiita.com/mr_noppo/items/fb9dbd302e214d400fda

# 使用したものや事前準備
Macbook Pro
Homebrew

# 主に参考にさせていただいた記事
https://isub.co.jp/%E3%80%90%E7%92%B0%E5%A2%83%E6%A7%8B%E7%AF%89%E3%80%91/%E3%80%90node-js%E3%80%91%E3%83%90%E3%83%BC%E3%82%B8%E3%83%A7%E3%83%B3%E7%AE%A1%E7%90%86%E3%82%92volta%E3%81%AB%E7%A7%BB%E8%A1%8C%E3%81%99%E3%82%8B/

# なんでnodebrewから移行するの？
nodebrewだけでもだいぶ便利になりましたよね、プロジェクトごとにバージョンが違うのですぐに切り替えられるのがとても魅力できたと思いました。:fist:
Voltaにしようと思ったのは、「プロジェクトごとにバージョンを固定できる」というところにさらなる魅力を感じたからです！切り替えすらいらないなんて・・・。
ただ、仕組みとしてはpackage.jsonにNode.jsのバージョンを保持することで切り替えるようです。なのでチーム開発で全員使っていないと固定は使えないかも。
でも、nodebrewと同じように切り替えは自在なので対応は柔軟にできそうです！

# 早速入れるためにnodebrewとはさようなら

まずは念のため、不要なNode.js関連のものをアンイストールしていきます。（nodebrew配下にデータがあるはずのでnodebrew自体を消せば全部綺麗に消えるとは思いますが。）
何をインストールしたか確認。

```
nodebrew list
```

![スクリーンショット 2024-02-18 8.34.01.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/943982/7743e11a-bed2-fdb9-82c6-61dda733d1b1.png)

アンインストールコマンドはこちら。全部消します。
```
nodebrew uninstall v18.17.0
```

homebrewからnodebrewをアンインストールします。
```
brew uninstall nodebrew
```

PATH 環境変数も消しておきましょう。(zshの方の説明になります）
```
vim ~/.zshrc
```
iキーを押した後に下記のコマンドを削除します。（ない方はそのまま）
```
export PATH=$HOME/.nodebrew/current/bin:$PATH
```
:wqで保存して抜けます。

.nodebrewを削除します。(rm -rfは扱い方注意）
```
rm -rf ~/.nodebrew/
```

# Volta導入
では、Voltaは導入していきます！

https://formulae.brew.sh/formula/volta
```
brew install volta
```

次にセットアップをコマンドを打ちます。自動でPATH 環境変数をカスタマイズしてくれます。
カスタマイズ用のファイルを検索して書き込んでくれるようなので、zshの方は「~/.zshrc」をvimでもいいので作成しておきましょう。
```
volta setup
```

PATH 環境変数が入ったか確認します。
```
cat ~/.zshrc
```
しっかり入ってますね！
![スクリーンショット 2024-02-18 8.57.40.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/943982/99ed6e1a-73ab-931b-9dc2-85f93445da83.png)

即適用するようにコマンドを実行します。
```
source ~/.zshrc
```

# hello Volta
では、先ほどアンインストーしたバージョン18.17.0をインストールしてみます。
```
volta install node@18.17.0
```
無事成功しました。
![スクリーンショット 2024-02-18 9.05.38.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/943982/7148c4c5-4825-337e-c5f8-390ac0df1ef9.png)

他のバージョンもインストールし、現在のアクティブなNode.jsを確認します。
```
volta list node
```

(default)が今設定しているバージョンのようです。（インストールがある意味、バージョン指定になりそう）
![スクリーンショット 2024-02-18 9.08.08.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/943982/287b057b-35ec-d8d2-819a-6be27b7cd7d4.png)

# 最後に
package.jsonでの固定化はプロジェクトが全然ないので今回は省略します。参考サイトをご覧ください！
