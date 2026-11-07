---
title: Dockerで環境構築（GIN（GO）+Air)
tags:
  - Go
  - Mac
  - Docker
  - gin
  - VSCode
private: false
updated_at: '2024-02-24T18:24:39+09:00'
id: 3e40debeb6eaf0dde8cf
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
友人と進めているアプリ開発でGINを使おうって話が上がりました！折角だからDockerで立ち上げたろう、と思ったのでイチからどう進めていったか書いていきます！

# 作成した環境
https://github.com/takizawa0548/sample-gin

# 使用したものや事前準備
・Macbook Pro
・GIN（GO）
・Air
・Docker

# 主に参考にさせていただいた記事
https://go.dev/doc/tutorial/getting-started

https://gin-gonic.com/ja/docs/quickstart/

https://kakakakakku.hatenablog.com/entry/2023/04/10/220248


# 検証：GOプロジェクト作成

まず、コンテナを起動して、Bashでシェルセッションを開始します。
```
docker run -it --rm golang:latest /bin/bash
```
プロジェクトを作成するためにホームディレクトリへ移動します。
```
cd
```

![スクリーンショット 2024-02-23 8.13.23.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/943982/2820dc5b-2a2c-dc88-cd65-78f6b32318ed.png)

ディレクトリを作成し移動します。

```
mkdir hello
cd hello
```

依存関係を管理してくれるgo.modファイルを作成します。
作成したいディレクトリ配下でinitを実行します。（検証なのでモジュールパスはexampleです。）

```
 go mod init example/hello 
```

go.modファイルの中を確認するとモジュールパスも記載されていることがわかります。

![スクリーンショット 2024-02-23 8.30.27.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/943982/3133143c-3e2f-4534-0670-dfff96a7aabc.png)

実行用にhello.goファイルを作成します。
vimが入っていないと思うのでまずはそこから
```
apt update
apt install -y vim
```

vimを実行し下記のソースを貼り付けます。
```
vim hello.go
```
```golang
package main 

import "fmt" 

func main() { 
    fmt.Println("Hello, World!") 
}
```

実行してみましょう。
```
go run .
```
下記のように表示されていればOKです。

![スクリーンショット 2024-02-23 8.38.39.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/943982/5bebcab9-bb0d-58cc-a47a-94e22b33bca6.png)

外部パッケージのインポートも試してみます。
hello.goを下記のソースで上書きしましょう。
```golang
package main

import "fmt"

import "rsc.io/quote"

func main() {
    fmt.Println(quote.Go())
}
```
依存関係を更新
```
go mod tidy
```
ちゃんと依存関係に含まれていることと実行できることを確認できました。

![スクリーンショット 2024-02-23 8.43.41.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/943982/24c32130-e35d-287f-c591-7eb5d52a8205.png)

GOプロジェクトの作成は理解できたので、exitで抜けてコンテナは削除します。

# 検証：GINプロジェクト作成
まっさらな状態になったところで次はGINプロジェクトの作成です。
下記コマンドを実行してください。
```
docker run -it --rm -p 8080:8080 golang:latest /bin/bash 
```
プロジェクトファイルを作成します。
```
mkdir -p $GOPATH/src/github.com/myusername/project && cd "$_"
```

サンプルの実行ファイルを取得しましょう。
```
curl https://raw.githubusercontent.com/gin-gonic/examples/master/basic/main.go > main.go
```
![スクリーンショット 2024-02-23 9.31.20.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/943982/b3dc186b-06f4-0bd6-2d98-0a6de91bed21.png)

go.modを生成します。

```
go mod init github.com/myusername/project
```

依存関係を更新します。
```
go mod tidy
```

実行して、アクセスしてみましょう。
http://localhost:8080/
```
go run main.go
```

接続を確認できました。（ソース実行は後半でやります）

![スクリーンショット 2024-02-23 9.34.38.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/943982/0cb81b7d-f97e-13ae-7f55-f27cec865b5c.png)

![スクリーンショット 2024-02-23 9.35.12.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/943982/946d3db2-d624-fb4a-3506-cc753d9c72e0.png)

# 本題：compose.ymlを作成して環境構築
今までの過程を通して、compose.ymlに実行内容を落とし込んでいきます。
単純に立ち上げるとホットリロードではないため、毎回コンテナをリスタートしなければいけなくなります。
面倒なのでAirも入れます。

```yml
version: '3'
services:
 golang:
  #プロジェクトを新規作成したい時はコメントアウトのコマンドを実行
  #docker compose run golang \
  #bash -c "curl https://raw.githubusercontent.com/gin-gonic/examples/master/basic/main.go > main.go \
  #&& go mod init github.com/takizawa0548/project \
  #&& go mod tidy"
  image: golang:latest
  ports:
   - 8080:8080
  volumes:
   - ./app:/go/src/github.com/takizawa0548/project
  working_dir: /go/src/github.com/takizawa0548/project
  command: bash -c "go install github.com/cosmtrek/air@latest && go mod tidy && air"

```

プロジェクト作成のコマンドです。（長いので正直あまり良くないと思いますがいい方法が思いつきませんでした。）
compose.ymlのあるフォルダで実行します。
```
docker compose run golang \
bash -c "curl https://raw.githubusercontent.com/gin-gonic/examples/master/basic/main.go > main.go \
&& go mod init github.com/takizawa0548/project \
&& go mod tidy"
```

コンテナを立ち上げます。

```
docker compose up
```

値が返ってくるかも含めて確認します。
http://localhost:8080/ping

ソースの実行も確認ができました。

![スクリーンショット 2024-02-23 10.25.45.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/943982/1d65db74-1389-df60-bb3c-4deedb734be4.png)


![スクリーンショット 2024-02-23 10.21.25.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/943982/abe249cf-d298-fa63-8af9-45aa795cb91b.png)

値も変えてみましょう。

![スクリーンショット 2024-02-23 10.58.48.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/943982/758388c9-ed6f-6af9-5416-a523d7345171.png)

更新します。変更されたことを確認できました！
![スクリーンショット 2024-02-23 10.59.22.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/943982/3d543913-45d9-30e4-3a21-3a4c98cebc4b.png)


# 最後に
これでいいのかは、もっと開発しないとわからないですがとりあえずGINプロジェクトを作成できました！
次はつなぎ込みとかできたらなと思います・・・！

# 次のお話
編集中・・・
