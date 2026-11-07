---
title: React Hook Formを勉強してみた①
tags:
  - React
  - VSCode
  - ReactHookForm
private: false
updated_at: '2024-05-04T16:49:04+09:00'
id: ebf4db9aac2dd5d4d1b0
organization_url_name: null
slide: false
ignorePublish: false
posting_campaign_uuid: null
agreed_posting_campaign_term: false
---
# はじめに
初めまして！
エンジニアになって数年、今まで本を読むだけでしたが、もっとプライベートで楽しみながら成長したい！自分が学んだ足跡を残していきたい！と思い記事を書きました！
最終的には自在に開発できるようになりたいと思っています。:triumph:
いろいろな記事を参考にさせてもらっています。:bow_tone2:
その中でもこれってどういう意味？とかつまづいたところを念入りに書いていこうかと思います。:fist:

# 今回の目的
ブラウザ更新を制御する時ってどうするんだろうという時にReactHookFormをしっかり学んでみようと思いクイックスタートから学んでみました！

# 使用したものや事前準備
・Macbook Pro
・VSCode

# 主に参考にさせていただいた記事
https://react-hook-form.com/get-started#Quickstart

https://www.youtube.com/watch?v=RkXv4AXXC_4

# reactプロジェクトのインストール
```terminal
npx create-react-app sample-react-form
```

# react-hook-formインストール
```terminal
npm install react-hook-form
```

# 参考ソースでreact起動
app.jsに参考ソースをコピペして、Reactを立ち上げます。

```terminal
npm start
```

下記の画像のように動作すればOKです。

![スクリーンショット 2024-05-04 15.25.02.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/943982/70568501-abf2-bdd2-6d98-166acc97621d.png)

## react Hook Form
### useFormで必要な関数を呼び出す。
1.register
2.handleSubmit
3.formState: { errors }
4.defaultValues
5.watch

### registerとhandleSubmit
registerは、Form内で定義し、送信したい値を持つタグに配置します。
handleSubmitは、submitボタン押下時に入力データを引き渡す関数（アロー関数でも問題なし）をセットします。
```react
<form onSubmit={handleSubmit(onSubmit)}>
    <input {...register("exampleRequired")} />
    <input type="submit" />
</form>
```

### 入力エラー
registerの後の記載のように、入力規則を設定できます。submit時に入力規則を違反しているとerrorsに格納されます。

```react
// 入力エラーを格納
formState: { errors }
// ４文字に満たない場合はエラー
<input {...register("exampleRequired", { minLength: 4 })} />
// エラー内容の確認
{errors && console.log(errors)}
```

下記がエラー内容です。

![スクリーンショット 2024-05-04 15.48.55.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/943982/a1cc6f78-92a9-c204-075b-e0d6ad9903a0.png)

さらにエラーメッセージを追加することができます。

```react
{ minLength:{ value:4, message:'Min Length is 4'} }
```

![スクリーンショット 2024-05-04 15.51.47.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/943982/f849c872-a3e7-7163-8c17-7a00f10cd811.png)

#### エラーの追跡

再レンダリング後はエラーをReactが追跡し始めます。ここで注意したいのが、別のstateのレンダリングでもエラーの追跡が始まるということです。

```react
const [count, setCount] = useState(0)
```
```react
//下記のように関係のないstate更新でもエラーの追跡が始まります。
<button onClick={()=>{setCount(c=>c+1)}}>test</button>
```

### defaultValuesで入力フォームの初期値をセットする
初期レンダリング時に、入力フォームにセットされます。
書き方①の場合は、存在しない場合はTypeScriptでエラー検知できるため推奨されています

```react
// 書き方①
const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
} = useForm({defaultValues: {example: 'ここが初期値！'}})
```

```react
// 書き方②
<input defaultValue="ここが初期値パート２！" {...register("exampleRequired")} />
```

### 入力値を追跡し、stateと同じようにレンダリングする
watch関数は、set関数を使った時のように値の変更と再レンダリングを行います。
```react
const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
} = useForm({defaultValues: {example: 'ここが初期値！'}})
```

レンダリングを行うため、定数にセットすることで表示する値をリアルタイムに変更できます。
```react
const example = watch('example')
```
```react
//入力フォームにregisterをセットしていれば、入力に合わせて値が変化する
<span>{example}</span>
```


# 次
長くなったので、次へ

