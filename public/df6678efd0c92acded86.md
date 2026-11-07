---
title: Python学んでみた　第２回（演算〜ファイル）
tags:
  - Python
  - Mac
  - Anaconda
  - JupyterNotebook
private: false
updated_at: '2024-03-07T16:55:59+09:00'
id: df6678efd0c92acded86
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
前回の続きです。（書いてたらすごい時間と量がかかっていた・・・！）

https://qiita.com/mr_noppo/items/edb3b1652b4bf695f708

# 使用したものや事前準備
・Macbook Pro
・Python
・Anaconda
・jupyter notebook


# Python
## 演算
・足し算
```python
42+10
(42).__add__(10) # 52
```
・４２の１００乗（オブジェクトなので基本オーバーフローしない）
```python
42**100
```

## Unicode文字列
・大文字変換
```python
name = 'taro'
name.upper() # TAROと表示（変数の中身はかわらない）
```
・複数行
```python
name = 'test'
test = f"""a
b{name}
c""" # a\nbtest\nc
```

## help系
表示したときに出てくるダンダー属性（__add__）はシステム内部で使用されているもので通常使用するものではないようです。
下部に表示されるものを使用しましょう

チェインできる関数を表示
```python
name = 'string'
dir(name)
```
どんな関数か説明を表示

```python
name = 'string'
help(name.upper)
```

Docの表示
※上記で説明したダンダー属性
```python
name = 'string'
name.__add__?
```

ソース例の表示
※上記で説明したダンダー属性
```python
name = 'string'
name.__add__??
```
![スクリーンショット 2024-03-03 14.19.39.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/943982/72c0ed82-1333-67cd-301c-83814de0c8d9.png)

## 条件文
インデントでブロックを表現します。この場合は「B」と「C」が表示される。
andやor、notはそのまま文字で表現する。&と|についてはbit演算に使用される。
```python
grade = 82
if grade > 90:
    print("A")
elif grade > 80:
    print("B")
    Print("C")
else:
    Print("D")

'A' != 'B' # true
```

## ループ文
インデントでブロックを表現します。
```python

for number in [1,2,3,4,5]: # 1~5
    print(number)

for number in range(1,7): # 1~6 半開区間（開始含む）
    print(number)

strs = ["A","B","C"]
for index, value in enumerate(nums):
    print(index, value) # 0 A...

dict = {"A":"TEST","B","TEST2"}
for key,value in dict:
    print(key, value) # A TEST...
```

## ファイル
### 作成
```python
fout = open('names.csv', mode='w', encoding='utf8')
```
### 書き込み
ファイル入出力ストリームが開いている間は反映されない
書き込まれたバイト数が表示される。
```python
fout.write('name\n')
```
### ファイルを閉じる
```python
fout.close()
```

### 一括で実行する
close()不要になる
```python
with open('names.csv', mode='w', encoding='utf8') as fout:
    fout.write('name\n')
    fout.write('taro\n')
    fout.write('jiro\n')
```

### ファイルの読み込み
```python
with open('names.csv', encoding='utf8') as fin:
    data = fin.read() # name\ntaro\njiro\n
    one_byte = fin.read(1) # b'n' 1バイトの読み込み
```

### 使用できる文字コードの確認
```python
import encodings
print(sorted(encodings.aliases.aliases))
```

# 続き
https://qiita.com/mr_noppo/items/c79cc6f959597ed18e0c
