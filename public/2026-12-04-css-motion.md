---
title: "CSS だけで作る、アプリのような動き（View Transitions・スクロール連動・:has()・コンテナクエリ）"
tags:
  - CSS
  - ViewTransitions
  - アニメーション
  - フロントエンド
  - 勉強会
private: false
updated_at: ''
id: null
organization_url_name: null
slide: false
ignorePublish: false
---
社内の勉強会で「ライブラリを足さなくても、CSS だけでここまで動かせる」という回を準備しました。その内容を、発表用のスライドから記事に書き直したものです。

以前は JavaScript のアニメーションライブラリや、スクロールを監視するコードが必要だった表現の多くが、いまは CSS 数行で書けます。この記事では、そのうち次の 4 つを、動かし方と「裏で何が起きているか」の両方から紹介します。

| # | 機能 | ひとことで |
| --- | --- | --- |
| 1 | View Transitions | 画面が切り替わる前後を、ブラウザがつないでくれる |
| 2 | スクロール連動アニメーション | アニメーションの「時間」を「スクロール位置」に置き換える |
| 3 | `:has()` | 子の状態で、親の見た目を変える |
| 4 | コンテナクエリ | 画面幅ではなく、置かれた枠の幅で部品が形を変える |

## この記事でわかること

- ページ遷移やスクロールの演出を、ほぼ JavaScript なしで作る方法
- それぞれの機能が、ブラウザの中でどう動いているか
- 動きを入れるときに守りたいこと（動きが苦手な人、未対応のブラウザ）

## 1. View Transitions

### 同じページの中で切り替える

並べ替えやフィルタ、タブの切り替えのように、同じページの中で DOM を書き換える処理は、`document.startViewTransition()` で包むだけで動きが付きます。

```js
button.addEventListener('click', () => {
  document.startViewTransition(() => {
    render(sortedItems) // ここで DOM を書き換える
  })
})
```

書き換えの前後で「同じもの」として扱いたい要素には、同じ名前を付けます。名前はページの中で 1 つだけにします（説明用に固定の名前にしていますが、デモでは CSS 変数で項目ごとに名前を付けています）。

```css
.card-sora { view-transition-name: card-sora; }
```

これで、カードが並べ替え前の位置から並べ替え後の位置へ、なめらかに移動します。

### 裏で起きていること

`startViewTransition()` を呼ぶと、ブラウザは次の 5 つを順に行います。

1. **撮影**：名前の付いた要素ごと（名前のない部分は、ページ全体 `root` としてまとめて）に、今の見た目を画像として保存し、画面の更新を止める
2. **書き換え**：渡した関数で DOM を書き換える（その間、ユーザーには古い画面が見えたまま）
3. **新しい状態を測る**：書き換えたあとの要素の位置と大きさを測る。こちらは画像ではなく実際の表示
4. **補間**：画面のいちばん手前に疑似要素の層を作り、古い位置・大きさから新しい位置・大きさへ動かしながら、古い画像と新しい表示を入れ替える
5. **片付け**：アニメーションが終わったら層を消し、本物の DOM を見せる

つまり、動いて見えているのは操作できない「写し」です。古い側は静止画、新しい側は実際の表示です。そのため DOM を大きく組み替えても崩れにくい一方、縦横比が大きく変わる要素は、写しがはみ出したりずれたりして見えます（`::view-transition-old()` / `new()` に `height: 100%; object-fit: cover;` などを当てて調整します）。

このとき作られる疑似要素は、次のような木の形になります。

```txt
::view-transition                              ← 画面全体を覆う層
├─ ::view-transition-group(root)               ← 名前のない部分（ページ全体）
│  └─ ::view-transition-image-pair(root)
│     ├─ ::view-transition-old(root)           ← 古い画面の画像
│     └─ ::view-transition-new(root)           ← 新しい画面
└─ ::view-transition-group(card-sora)          ← 位置と大きさを補間する箱
   └─ ::view-transition-image-pair(card-sora)
      ├─ ::view-transition-old(card-sora)
      └─ ::view-transition-new(card-sora)
```

`view-transition-name` を付けた数だけ group ができます。**同じ名前が 2 つあると、アニメーションが中止されます**（DOM の書き換え自体は行われます）。注意してください。

### 別のページへ移るとき

SPA にしなくても、普通のリンクで別のページへ移るときに動きを付けられます。遷移元と遷移先の両方のページに、次の 1 行を書くだけです。

```css
@view-transition { navigation: auto; }

/* 一覧のサムネイルと、詳細ページの大きな画像に同じ名前を付ける */
.thumb-sora { view-transition-name: card-sora; }  /* 一覧ページ */
.hero       { view-transition-name: card-sora; }  /* 詳細ページ */
```

一覧のサムネイルが拡大しながら詳細ページの画像になり、ブラウザの「戻る」では逆向きに動きます。

この場合、2 つのページは別々の文書なので、両者をつなぐ手がかりは **名前（文字列）だけ** です。流れは次のとおりです。

1. リンクを押す。通信している間も、古いページは表示されたまま
2. 応答が届き、切り替わる直前に古いページで `pageswap` イベントが発火し、そのあと古いページが撮影される
3. 新しいページでは最初の描画の直前に `pagereveal` イベントが発火し、同じ名前どうしがつながれる

`pageswap` と `pagereveal` は、スクリプトから遷移を調整するためのきっかけです。`pagereveal` を使うなら、最初の描画より前にリスナーを登録する必要があります（`<head>` に普通の `<script>` で書きます）。

そのため、遷移先のページは「最初に描画される前に」名前と中身が決まっている必要があります。中身を JavaScript で作るなら、`<script blocking="render">` で描画を待たせます。ただし、待たせている間はすべての訪問者で最初の表示が遅れます。また Chrome では、新しいページの描画までに時間がかかりすぎると、遷移が飛ばされます。待たせる処理は最小限にしてください（`blocking` 属性の対応状況はブラウザによって違います）。

対象になるのは、同じオリジン（スキーム・ホスト・ポートがすべて同じ）の中の遷移だけです。サブドメインをまたぐと動きません。

### 動きを変える

動きを変えたいときは、さきほどの疑似要素に普通の `@keyframes` を当てます。

```css
/* fade-out / fade-in / rise は自分で @keyframes を定義する */
/* both を付けないと、短い側が終わったあとに元の見た目へ戻ってちらつく */
::view-transition-old(root) { animation: fade-out 200ms both; }
::view-transition-new(root) { animation: fade-in 300ms both; }

/* 本文だけ下からふわっと出す */
::view-transition-new(detail-body) {
  animation: rise 400ms cubic-bezier(.2, .8, .2, 1) both;
}
```

## 2. スクロール連動アニメーション

### 読了バーを数行で

ページの上に、どこまで読んだかを示すバーを出す例です。

```css
.progress {
  position: fixed; top: 0; left: 0; right: 0; height: 4px;
  background: #5b7cfa;
  transform-origin: left;
  animation: grow linear both;
  animation-timeline: scroll(root); /* 時間の代わりに、ページのスクロール量で進める */
}
@keyframes grow { from { scale: 0 1; } }
```

スクロールイベントを拾う JavaScript はいりません。上へ戻すと、バーも巻き戻ります。

`animation-timeline` は、必ず `animation` の **後** に書きます。`animation` の一括指定は `animation-timeline` を初期値に戻すためです。また、未対応のブラウザでは全幅のバーが出たままになるので、`@supports (animation-timeline: scroll())` の中に書くか、未対応のときは隠しておきます。

### 画面に入ったらフェードイン

要素が画面に入ってきたときに、下からふわっと出す例です。

```css
.reveal {
  animation: reveal linear both;
  animation-timeline: view();             /* 要素の見え具合で進める */
  animation-range: entry 0% cover 35%;    /* 入り始めから、cover 区間の 35% 地点まで */
}
@keyframes reveal { from { opacity: 0; translate: 0 48px; } }
```

これまで IntersectionObserver で「見えたらクラスを付ける」と書いていた処理を置き換えられます。ただし、上へ戻すとアニメーションも巻き戻る点が、「一度表示したらそのまま」の実装とは違います。パララックスや、縦にスクロールすると横に送られるギャラリーも、同じ仕組みで作れます。

### 裏で起きていること

`@keyframes` 自体は普通のアニメーションと同じです。変わるのは **進み具合を何で決めるか** だけです。

| 書き方 | 0% | 100% |
| --- | --- | --- |
| 普通のアニメーション | 経過時間 0 秒 | 指定した時間が経ったとき |
| `animation-timeline: scroll()` | スクロール位置が先頭 | スクロール位置が末尾 |
| `animation-timeline: view()` | 要素が画面の下端から入り始めたとき | 要素が画面の上端から出きったとき |

ここでの「画面」は、正確には「いちばん近い、スクロールする祖先の箱」です。ふつうはページ全体ですが、`overflow: auto` の箱の中に置いた要素は、その箱が基準になります。

時間で指定した `animation-duration` は、区間に対する割合に読み替えられます（遅延などがなければ、区間いっぱいに伸びます）。後で触れる「動きを止める」設定で、よくある `animation-duration: 0.01ms` が効かないのはこのためです。

また、動かすのが `transform`（`scale` や `translate` などの個別の指定も含む）と `opacity` だけなら、JavaScript の処理でページが混んでいても、なめらかに動きます。Chrome では、こうしたアニメーションを、メインスレッドとは別の「コンポジター」が受け持つためです。

`view()` と組み合わせる `animation-range` の主な区間は、次の 4 つです（ほかに `entry-crossing` と `exit-crossing` があります）。

| 区間 | いつ |
| --- | --- |
| `cover` | 少しでも見えている間（入り始めから、出きるまで） |
| `contain` | 全体が画面に収まっている間（要素が画面より大きいときは、画面を覆っている間） |
| `entry` | 下から入ってくる途中 |
| `exit` | 上へ出ていく途中 |

始まりと終わりで別の区間を使えます。さきほどの `entry 0% cover 35%` は、「entry 区間の 0%（入り始め）」から「cover 区間の 35% 地点」まで、という意味です。

## 3. `:has()` — 親を選べるセレクタ

```css
/* チェックされたラジオを含むカード */
.plan:has(> input:checked) { border-color: var(--accent); }

/* 1 つ選ばれたら、残りを薄くする */
.plans:has(input:checked) .plan:not(:has(> input:checked)) { opacity: .55; }

/* 未入力・形式違いがあれば、送信ボタンを薄くする（押せなくはしない） */
form:has(input:invalid) button[type="submit"] { opacity: .4; }
```

「状態に合わせてクラスを付け替える JavaScript」の多くが不要になります。

普通のセレクタは、対象の要素から祖先を見上げて判定します（`.a .b` なら、`.b` を見つけてから祖先に `.a` があるかを調べます）。`:has()` は逆に、祖先から子孫の状態を問い合わせます。子の状態（チェック・入力・ホバー）が変わるたびに、ブラウザは影響を受ける祖先だけを判定し直します。

速さのためには、`body:has(...)` のような広い起点を避け、`:has(> input:checked)` のように調べる範囲を狭めるのがコツです。

## 4. コンテナクエリ — 部品が自分で形を変える

```css
.profile-slot { container-type: inline-size; }
.profile { display: grid; gap: 12px; }
.profile .stats { display: none; }


@container (min-width: 380px) {
  .profile { grid-template-columns: auto 1fr; }        /* 横並びにする */
}
@container (min-width: 560px) {
  .profile .stats { display: flex; }                   /* 数字も出す */
}
.profile h3 { font-size: clamp(1rem, 4cqi, 1.5rem); }  /* 枠の幅に合わせる */
```

メインの欄に置いてもサイドの欄に置いても、同じ部品がその場に合った形になります。デザインシステムの部品と相性のいい機能です。

`container-type: inline-size` は、「この箱の横幅（正確には文字の進む方向の長さ。縦書きなら縦）は、中身によって決まらない」という約束です。この約束があるので、「箱の幅 → 中身のスタイル」と一方向に決められます（中身が幅を変え、その幅でまた判定し…という繰り返しになりません）。`@container` は、いちばん近い祖先のコンテナの幅で判定します。`cqi` はコンテナの幅の 1% です。

つまずきやすい点が 2 つあります。

- コンテナは自分の大きさで自分を判定できません。そのため、判定したい部品（`.profile`）の外側に、コンテナ用の箱（`.profile-slot`）を置きます
- コンテナにした箱は、中身から幅が決まりません。幅を中身に任せている場所（幅が `auto` の flex アイテムや `inline-block` など）に置くと、幅が 0 につぶれます。幅が決まる場所に置くか、幅を指定します

## 使うときに守りたいこと

- **動きが苦手な人に配慮する**：`prefers-reduced-motion` で動きを止めます。ただし、定番の「`*` に `animation-duration: 0.01ms`」は、スクロール連動と View Transitions には効きません。スクロール連動は時間を使わないため、View Transitions は `*` が `::view-transition-*` の疑似要素に当たらないためです。次のように書き分けます

```css
/* 別ページへの遷移は、動きを許可している人にだけ有効にする */
@media (prefers-reduced-motion: no-preference) {
  @view-transition { navigation: auto; }
}

@media (prefers-reduced-motion: reduce) {
  .progress, .reveal { animation: none; }
  ::view-transition-group(*),
  ::view-transition-old(*),
  ::view-transition-new(*) { animation: none; }
}
```

```js
// ページ内の遷移は、JavaScript で分ける
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
if (reduce || !document.startViewTransition) render(sortedItems)
else document.startViewTransition(() => render(sortedItems))
```

- **未対応のブラウザでは動きなしにする**：`@supports` や `if (!document.startViewTransition)` で分け、動きのない普通の表示にします
- **やりすぎない**：遷移は 200〜400ms 程度にし、動きは「どこに何が移ったか」を伝えるために使います
- **対応状況を確かめる**（2026 年 11 月時点）：`:has()` とコンテナクエリは、主要なブラウザすべてで広く使えます。ページ内の View Transitions とスクロール連動も主要なブラウザすべてで使えるようになりましたが、対応してからまだ日が浅い（Baseline の「Newly available」）ので、古いバージョンの利用者が多いなら未対応の表示も用意します。別ページへの View Transitions（`@view-transition`）は、Firefox がまだ対応していません。最新の状況は MDN や web.dev の Baseline の表示で確認してください

## デモ

勉強会用に作ったデモを公開しています。各ページの右上にある「仕組みを見る」をオンにすると、裏で起きていることを画面に表示します。

https://github.com/takizawa0548/tech-meetup-public/tree/main/demos/2026-12-04-css-motion

| ページ | 内容 | 「仕組みを見る」で表示されるもの |
| --- | --- | --- |
| `index.html` / `detail.html` | View Transitions（ページ内の並べ替え、カードから詳細ページへ） | 遷移を約 2 秒に遅くし、古い画面の写しに赤枠、新しい画面に緑の点線。作られた group の一覧 |
| `scroll.html` | スクロール連動（読了バー、フェードイン、パララックス、横送り） | 各アニメーションの今の進み具合 |
| `has.html` | `:has()` の選択カードとフォーム、コンテナクエリのプロフィール | 今効いているセレクタと `@container` の条件、各コンテナの幅 |

ファイルを直接開く（`file://`）と、デモは動きません（JavaScript のモジュールが読み込めないため）。リポジトリを取ってきて、ローカルのサーバーから開いてください（開き方はデモの README にあります）。

## まとめ

- **View Transitions**：画面の前後をつなぐ。別ページへの遷移でも、両方のページに CSS を 1 行ずつ書けば動く
- **スクロール連動**：`animation-timeline` で、JavaScript なしの演出ができる
- **`:has()`**：子の状態で親を変えられ、クラスを付け替える JavaScript が減る
- **コンテナクエリ**：部品が置き場所に合わせて形を変える

最初に試すなら、「読了バー」か「並べ替えの View Transition」がおすすめです。どちらも数行で、効果がすぐ目に見えます。

## 参考

- [MDN View Transition API](https://developer.mozilla.org/ja/docs/Web/API/View_Transition_API)
- [MDN スクロール駆動アニメーション](https://developer.mozilla.org/ja/docs/Web/CSS/CSS_scroll-driven_animations)
- [MDN :has()](https://developer.mozilla.org/ja/docs/Web/CSS/:has)
- [MDN コンテナクエリ](https://developer.mozilla.org/ja/docs/Web/CSS/CSS_containment/Container_queries)
- [web.dev Baseline](https://web.dev/baseline)
