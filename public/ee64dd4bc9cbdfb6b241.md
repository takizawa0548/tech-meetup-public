---
title: '5分で読むReact豆知識 | 入門 | 第4回: イベントハンドラ命名規則'
tags:
  - 初心者
  - 入門
  - フロントエンド
  - React
  - 5分で読む
private: false
updated_at: '2024-05-06T07:44:55+09:00'
id: ee64dd4bc9cbdfb6b241
organization_url_name: null
slide: false
ignorePublish: false
posting_campaign_uuid: null
agreed_posting_campaign_term: false
---
# はじめに
このシリーズは、Reactの公式ページなどから特に重要と感じたトピックを選び出し、何度でも読み返せるよう簡潔にまとめたものです。:orange_book:

**進捗管理には「いいね」か「ブックマーク」がお勧め**
さらに僕のモチベーションアップになります！:thumbsup:よろしくお願いいたします！:thumbsup:

**[シリーズ一覧はこちら](https://qiita.com/mr_noppo/items/9f2841fd0bc574a4685c)**


# イベントハンドラ命名規則

### １\. イベントハンドラ関数の名称

**「handle+イベントの名称」**
で命名するのが一般的です。
どのイベントに対応するかを明確にします。

・クリックした時：handleClick
・マウスポインタが入ってきた時：handleMouseEnter

### ２\. Propsとしてイベントハンドラを渡す際の名称
**「on+自由記載」**
を使用します。
どのようなイベントハンドラを渡されるか直感的にわかるようにします。

・再生するボタン：onPlay

### 実装例

```jsx
// onPlayをpropsとして受け取る
function Button({ onPlay, children}) {
    return (
        <button onClick={onPlay}>
            {children}
        </button>
    );
}

function PlayButton() {
  // handlePlayClickで処理内容を記載
  function handlePlayClick() {
    alert(`play`);
  }

  return (
    <Button onPlay={handlePlayClick}>
      Play Movie
    </Button>
  );
}

export default function Toolbar() {
  return (
    <PlayButton/>
  );
}
```

## 参考サイト
より詳しく学びたい方はこちら
### イベントハンドラについて
https://ja.react.dev/learn/responding-to-events
