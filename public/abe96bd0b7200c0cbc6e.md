---
title: Dockerイメージのタグ構成（PHP＆PostgreSQL）
tags:
  - PHP
  - PostgreSQL
  - Docker
  - DockerHub
private: false
updated_at: '2024-02-26T07:15:18+09:00'
id: abe96bd0b7200c0cbc6e
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
Dockerのイメージを選ぶときに、「これどう意味なの？何を基準に判断すればいいの？」となりました。使う範囲でいいから一通りの内容やルールを理解してから使いたいですよね。:thinking:
対象範囲はPHPとPostgreSQLに絞りました。長くなったので記事は二つに分けています！

今回は前回の続きになります！

https://qiita.com/mr_noppo/items/79e0dbcfaebea8c8192b

## 使用したものや事前準備
・Docker Hub
・PHP
・PostgreSQL

## 主に参考にさせていただいた記事
Docker Hubの情報を読みながら、わからないところは参考記事やChatGPTに解説してもらいました。
参考記事は本文中に掲載します！

https://hub.docker.com/

https://chat.openai.com/

# PHPのタグ構成
早速ですが下記の中央より下のところに説明がありました。
今回は読み合わせになりそうなので「端的に言えばこういうことでは？」のレベルでまとめていきたいと思います。

※確実な情報は下記のリンクを参照ください。

https://hub.docker.com/_/php

### php:\<version>-cli
コマンドラインに特化したイメージ。コマンドラインアプリケーション開発やスクリプト実行用。
Webサーバーにはならない。

### php:<version>-apache
DebianとApache httpdイメージ。
Webサーバーが組み込まれているため、Webアプリケーションの開発やデプロイメントに最適。

### php:<version>-fpm
アプリケーションサーバーにあたる。Nginxコンテナとの組み合わせで使われる。
PHPのFastCGIで効率的に動的ページを作成する。

### php:<version>-alpine
Alpine Linux。軽量最低限のため必要なものは自分でインストールしてカスタマイズする。
公式イメージが正しいと思うなよっていうのは、目から鱗でした。ここでDockerFileが必要なんだなとも。

https://qiita.com/pottava/items/970d7b5cda565b995fe7

https://speakerdeck.com/stormcat24/oqian-falsedockerimezihamadazhong-i?slide=49

# PostgreSQLのタグ構成
DebianかAlpine Linuxの二択でした。
軽量にしたいからAlpne Linuxでいいんじゃないかと思ったが互換性のないツールもあるため簡単に選んでいいものではなさそう。
また、PostgreSQLのタグ構成のDockerfileを見ると、bookworm-slimとなっているため軽量対策も進んでそうです。

https://github.com/docker-library/postgres/blob/ab6925051ca097d415816928a50c483ecc370c00/16/bookworm/Dockerfile

Slimがついているイメージは使用頻度の低いパッケージを削除します。

https://zenn.dev/ken3pei/articles/1abbf7d974cf5d

### <version>-bookworm
Debian（Linuxディストリビューション）のバージョン12

### <version>-bullseye
Debian（Linuxディストリビューション）のバージョン11

### <version>-alpine
Alpine Linux

## 最後に
たださらっとみただけではメリットデメリットをはっきり説明できるところまで行けませんでしたが、どんな意味を持つかはわかりました！
コンテナ構築に活かしまくります！
