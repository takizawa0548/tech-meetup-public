---
title: GitHub Actions学んでみた③
tags:
  - GitHub
  - GitHubActions
private: false
updated_at: '2024-06-20T20:33:40+09:00'
id: da814ef0cdfbe18a585e
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

**「いいね」か「ブックマーク」**
を頂けると僕のモチベーションアップになります！:thumbsup:
少しでも気に入っていただけたらよろしくお願いいたします！:thumbsup:


# 今回の目的
自分の作ったコンポーネントを確認したり検証するための技術を身に付けたい！
公式のクイックスタートを参考に進めていきます。
項目ごとに補足のみ書いて進めています。わかりづらいところの理解の手助けになれば幸いです！

# 主に参考にさせていただいた記事

https://docs.github.com/ja/actions/quickstart

# GitHub Actions の重要な機能
環境変数、カスタマイズされたスクリプトなどを含む GitHub Actions ワークフローを作成する方法

## ワークフローで変数を使用する
下記の場合、envが変数です。
```yml
jobs:
  example-job:
    runs-on: ubuntu-latest
    steps:
      - name: Connect to PostgreSQL
        run: node client.js
        env:
          POSTGRES_HOST: postgres
          POSTGRES_PORT: 5432
```

## ワークフローにスクリプトを追加する
working-directoryは、runコマンドを実行する場所を指しています。
```yml
jobs:
  example-job:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./scripts
    steps:
      - name: Check out the repository to the runner
        uses: actions/checkout@v4  
      - name: Run a script
        run: ./my-script.sh
      - name: Run another script
        run: ./my-other-script.sh
```

## ジョブ間でデータを共有する
別のジョブで共有できるデータを作成するrunコマンドです。
```yml
      - name: Upload output file
        uses: actions/upload-artifact@v4
        with:
          name: output-log-file
          path: output.log
```
ダウンロード
```yml
      - name: Download a single artifact
        uses: actions/download-artifact@v4
        with:
          name: output-log-file
```

# 次
https://qiita.com/mr_noppo/items/6435a78e5a12be205cc3
