---
title: Dockerイメージ紹介（Docker Official Image）
tags:
  - PHP
  - Mac
  - PostgreSQL
  - Docker
  - VSCode
private: false
updated_at: '2024-02-26T07:16:00+09:00'
id: 79e0dbcfaebea8c8192b
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
対象範囲はPHPとPostgreSQLのDocker Official Imageに絞りました。長くなりそうなので記事はいくつかに分けて公開していきます！
今回は下記の内容で進めていきます！

<dl>
  <dt>DockerHubで検索</dt>
  <dd>検索文言：php</dd>
  <dd>指定フィルター：Images、Docker Official Image、Linux</dd>
</dl>

![スクリーンショット 2024-02-20 0.05.47.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/943982/c75f56ae-bf24-e0b2-9fb2-08ab35b8daa5.png)

早速進めていくために検索をすると、関連したイメージがたくさん出てきました。
PHPに焦点を絞ってもいいんですが、どんな関連性があって結果として表示されたのか気になりませんか？僕は気になってしまったのでここから始めていきます！:bow:

## 使用したものや事前準備
・Macbook Pro
・Docker Hub
・Visual Studio Code
・PHP
・PostgreSQL

## 主に参考にさせていただいた記事
Docker Hubの検索結果に出たDocker Official Imageを、ChatGPTに解説してもらい検証しました。

https://hub.docker.com/

https://chat.openai.com/


# PHPが関連するDocker Official Images

※注意：PHPで作成されたツールも紹介しているため、その場合は他の開発言語でも活用できます。

### ⚫︎adminer
MySQL、PostgreSQL、SQLite、MongoDBなど複数のデータベースシステムをサポートするWebベースのデータベース管理ツール

DBをGUIで操作できるツールですね。Dockerで立ち上げたDBを操作できれば快適に開発できそうです。ちょっと古そう？ですが軽量なのもメリットです。

![スクリーンショット 2024-02-20 0.23.22.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/943982/9476b026-b22c-1892-9940-b6ce72727f63.png)

【検証内容】

・compose.ymlを下記のように編集します。

```yml
version: '3.1'

services:
  adminer:
    image: adminer
    restart: always
    ports:
      - 8080:8080
    platform: linux/amd64 # ARMベースのマシンで必要な場合

  db:
    image: mysql:5.7
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: example # ここでパスワードを設定
    volumes:
      - db_data:/var/lib/mysql
    platform: linux/amd64 # ARMベースのマシンで必要な場合

volumes:
  db_data:
```

・コンテナを立ち上げましょう。

```
 docker compose up
```

・下記URLにアクセスします。
http://localhost:8080

・下記の情報でログインしてください。
データベース種類：MySQL
サーバ：db
ユーザ名:root
パスワード:example
データベース:

・ログインできたら、色々探索してみましょう。

### ⚫︎composer
PHPで書かれたアプリケーションやライブラリの依存関係を管理するために広く使用されているツール

例えばcomposerが必要なLaravelプロジェクトを作成したい時に、配置したいフォルダで下記のコマンドを実行しても作成できます。これは便利です。
```
docker run -v ./:/app composer:latest create-project --prefer-dist laravel/laravel .
```
本当にそれで運用できるのかというのもあるのでさらに検証も必要そうですが、常に最新のcomposerにアップデートしてくれるコンテナを立ち上げられたらよさそうですね。

（なかなか独特なアイコンだな〜）

![スクリーンショット 2024-02-20 6.53.40.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/943982/e1edbf95-7094-a9f6-a5a4-7188ed737507.png)

【検証内容】

・compose.ymlを下記のように編集します。

```yml
version: '3.8'

services:
  php:
    image: php:8.0-apache
    volumes:
      - ./api:/var/www/html
    ports:
      - "8080:80"

  composer:
    image: composer:latest
    volumes:
      - ./api:/app
    command: 'composer update'
```

・apiフォルダを作成しましょう。

・コマンドを実行しLaravelプロジェクトを作成します。

```
 docker compose run composer create-project --prefer-dist laravel/laravel .
```
・プロジェクトが作成されたら、apiフォルダ直下にtest.phpを作成してください。（コードは適当です）

```php
<?php
  try {
    $dbh = new PDO('mysql:host=db;dbname=testdb','testuser','testpass');
    echo "OK";
    $dbh = null;
  }catch(PDOException $e){
    echo "NGsss";
    exit;
  }
?>

```
・コンテナを立ち上げましょう。
```
 docker compose up
```

・下記URLにアクセスし、"NGsss"とか表示されればOKです。
http://localhost:8080/test.php

### ⚫︎phpmyadmin
MySQLとMariaDBに対応しているデータベース管理ツール

こちらもDBをGUIで操作できるツールですね。画面はリッチですね。
ただ調べていくとリッチであるが故に重いとか、対応しているデータベースがadminerより狭いという評価がありました。

![スクリーンショット 2024-02-20 8.38.31.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/943982/c5153d29-83eb-3319-9c1d-f2338f33782f.png)

【検証内容】

・compose.ymlを下記のように編集します。

```yml
version: '3.1'

services:
  db:
    image: mysql:5.7
    environment:
      MYSQL_ROOT_PASSWORD: example
      MYSQL_DATABASE: mydb
      MYSQL_USER: user
      MYSQL_PASSWORD: password
    ports:
      - "3306:3306"
    volumes:
      - my-db:/var/lib/mysql

  phpmyadmin:
    image: phpmyadmin/phpmyadmin
    environment:
      PMA_HOST: db
      PMA_USER: user
      PMA_PASSWORD: password
      UPLOAD_LIMIT: 50M
    ports:
      - "8080:80"
    depends_on:
      - db

volumes:
  my-db:
```

・コンテナを立ち上げましょう。

```
 docker compose up
```

・下記URLにアクセスします。
http://localhost:8080

・色々探索してみましょう。

### ⚫︎MediaWiki 
フリーかつオープンソースのウィキソフトウェア

Wikiですね（そのまんま）。
コンテナで立ち上げて、名前付きボリュームで永続化すればプロジェクトごとのWikiとか広く共有できそうで夢がありそうです。
情報も綺麗に整理できそうなので一回は試してみたいですね。

コンテナを立ち上げてアカウント作成までが終わった後の画面です。

![スクリーンショット 2024-02-20 9.30.27.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/943982/8829ef63-861d-6bc8-17bc-65165effb526.png)

実際に作成されている方がいるので紹介です。こちらを参考に進めていきます。

https://qiita.com/You_name_is_YU/items/98ad1ee121067c1cdf85

【検証内容】

・compose.ymlを下記のように編集します。

```yml
version: '3'

services:
  mediawiki:
    image: mediawiki
    ports:
      - "80:80"
    volumes:
      - ./mediawiki/images:/var/www/html/images
      # 以下の行を編集して、LocalSettings.phpをホストマシンからコンテナにマウントします。
      #- ./mediawiki/LocalSettings.php:/var/www/html/LocalSettings.php

  database:
    image: mysql:5.7
    environment:
      MYSQL_DATABASE: my_wiki
      MYSQL_USER: wikiuser
      MYSQL_PASSWORD: example
      MYSQL_RANDOM_ROOT_PASSWORD: mysqluser000
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql

volumes:
  mysql_data:
```
・./mediawiki/imagesのフォルダを作成します

・コンテナを立ち上げましょう。

```
 docker compose up
```

・下記URLにアクセスします。
http://localhost:80

・セットアップをしていきます。
※途中でデータベースのホストを指定しますが、コンテナ名（database）のため注意しましょう。

・最低限の設定をしたらLocalSettings.phpをダウンロードします。

・ダウンロードが完了したら、compose downしましょう。

```
docker compose down
```

・LocalSettings.phpを「./mediawiki」に配置します。

・compose.ymlに記載されている下記のコメントアウトを外して、マウントされるようにします。

```yml
#- ./mediawiki/LocalSettings.php:/var/www/html/LocalSettings.php
```

・再度立ち上げてログインします。

・指示通りキーを入力してセットアップ完了です。

・念のため、アカウント作成後にコンテナを再起動してもデータが保存されているところまで確認しましょう。

・後は色々探索しましょう。

### ⚫︎yourls
独自のURL短縮サービスを作成するためのオープンソースのPHPベースのアプリケーション

Qiitaはもちろん、X（Twitter）やGitHubのURLが[ドメイン/ユーザー名]でアクセスできる理由がわかりました。裏側でURL短縮サービスがパラメータを付与してアクセスしているんですね。
こちらはまだ使用イメージがつかないので検証は機会があればやることにします。

実際に作成されている方がいるので紹介です。

https://www.photopierre.com/blog/2010/11/28-201115091/

### ⚫︎php-zendserver
Zend Serverは、Zend Technologiesによって開発された、PHPアプリケーションの展開、管理、運用を最適化するためのエンタープライズクラスのウェブアプリケーションサーバー

Zend ServerにPHP実行環境をつけたものになりますが内容が難しかったです。障害検知とかもやってくれるそうですが、今はクラウドとかがやっているから要らないような気もします。大規模アプリケーション向けのようです。
こちらも機会があれば検証します。

以下の記事を参考にさせていただきました。

https://pentan.info/php/zend_server.html

## 最後に
PHPが関連するDocker Official Imageについてまとめました！
途中からPHP専用じゃなくてPHPで作られているものも検索結果に出ているんだって気づきましたが、そりゃそっかって感じでした。
今後は、いろんなイメージを組み合わせてこんな構成にしようとか妄想をどんどん膨らませていこうと思います！:thumbsup:

