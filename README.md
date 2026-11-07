# tech-meetup-public

社内ミートアップから **社外に公開してよいもの** だけを置く公開リポジトリです。

- `demos/` … 実際に触れるデモ（誰でも clone して試せる）
- `public/` … Qiita 記事（[Qiita CLI](https://github.com/increments/qiita-cli) で管理。main にマージすると自動投稿。投稿アカウントの既存記事も同期されています）

スライドの元データや社内の運営情報は、Private の `tech-meetup` リポジトリにあります。

## 公開前に必ず確認

- 顧客名・案件名・社内システムの URL・キー・社員の個人情報が入っていない
- 業務コードをそのままコピーしていない（説明用に書き直したものだけ）
- 引用した画像・文章の出典を書いた

## デモを追加する

```
demos/
  2026-11-20-react-hooks/
    README.md     何のデモか・動かし方
    index.html    ビルド不要の HTML が基本
```

## Qiita 記事を書く

```bash
npm install
cp public/_template.md public/2026-11-20-react-hooks.md
npm run preview        # http://localhost:8888 でプレビュー
```

1. `ignorePublish: true` のまま書き始める（誤って投稿されない）
2. 書けたら `ignorePublish: false` にして PR
3. レビューで公開チェックが済んだら main にマージ → GitHub Actions が Qiita に投稿
4. 投稿後、Actions が `id` と `updated_at` を書き戻すコミットを入れます。以降はそのファイルを直すと記事が更新されます

### 投稿アカウントについて

`QIITA_TOKEN`（リポジトリの Secret）に設定したアカウントで投稿されます。
自分のアカウントで出したい人は、記事ファイルを自分の Qiita CLI リポジトリにコピーして投稿してください。
社の Qiita Organization に紐づける場合は `organization_url_name` を設定します。

### 既存の記事も入っています

`public/` には、投稿アカウントがこれまでに Qiita で公開した記事もすべて入っています（ファイル名が英数字 20 桁のもの）。
投稿のたびに Qiita 側と同期されるため、消しても次の実行で戻ります。

- **既存記事のファイルを直して main にマージすると、Qiita の記事もそのまま更新されます**。直すつもりがない記事には触れないでください
- ミートアップの新しい記事は `YYYY-MM-DD-<スラッグ>.md` の名前で作り、既存記事と見分けられるようにします
- レビューでは、差分に既存記事のファイルが含まれていないかを確認してください

## 初期設定（管理者のみ・1 回だけ）

1. Qiita の [アクセストークン](https://qiita.com/settings/tokens/new) を `read_qiita` `write_qiita` で発行
2. GitHub のリポジトリ設定 → Secrets and variables → Actions に `QIITA_TOKEN` として登録
