---
title: GitHub Actions学んでみた⑦
tags:
  - GitHub
  - GitHubActions
private: false
updated_at: '2024-07-11T09:10:38+09:00'
id: ebec977f6af168fb4eca
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

# 今回の目的
自分の作ったコンポーネントを確認したり検証するための技術を身に付けたい！
公式のクイックスタートを参考に進めていきます。
項目ごとに補足のみ書いて進めています。わかりづらいところの理解の手助けになれば幸いです！

# 主に参考にさせていただいた記事

https://docs.github.com/ja/actions/quickstart

# 変数

## 単一のワークフローの環境変数の定義
ワークフローファイル内のenvキーを使用して環境変数を定義

DAY_OF_WEEK：ワークフロー全体
Greeting：job内
First_Name：step内

```yml
env:
  DAY_OF_WEEK: Monday

jobs:
  greeting_job:
    env:
      Greeting: Hello
    steps:
      - name: "Say Hello Mona it's Monday"
        run: echo "$Greeting $First_Name. Today is $DAY_OF_WEEK!"
        env:
          First_Name: Mona
```

## 複数のワークフローに対する構成変数の定義　｜　コンテキストを使用した変数の値へのアクセス

varsコンテキストを使用する

https://qiita.com/mr_noppo/items/80dfe7111848527ce68e

## 既定の環境変数
GitHubが設定する既定の環境変数は、ワークフローのどのステップでも使用可能

一覧はこちら

https://docs.github.com/ja/actions/learn-github-actions/variables#default-environment-variables

## オペレーティング システムの検出
現在実行中のOSの検出する。runner.osで抽出
```yml
on: workflow_dispatch

jobs:
  if-Windows-else:
    runs-on: macos-latest
    steps:
      - name: condition 1
        if: runner.os == 'Windows'
        run: echo "The operating system on the runner is $env:RUNNER_OS."
      - name: condition 2
        if: runner.os != 'Windows'
        run: echo "The operating system on the runner is not Windows, it's $RUNNER_OS."
```


# 次
スターター ワークフローの使用から
