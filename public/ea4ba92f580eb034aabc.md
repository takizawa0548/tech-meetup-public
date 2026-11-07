---
title: 隙間時間にみる早見表〜OracleJavaSE11 gold | ラムダ式 〜
tags:
  - Java
  - oracle
  - 資格
private: false
updated_at: '2024-07-13T15:16:15+09:00'
id: ea4ba92f580eb034aabc
organization_url_name: null
slide: false
ignorePublish: false
posting_campaign_uuid: 16baee61b1d8bd4aac5a
agreed_posting_campaign_term: true
---
# この記事について
OracleJavaSE11 goldを勉強していた時になかなか覚えられないな〜っとなっていた内容を毎回見ることができるようにこちらの書籍で勉強していた時のまとめたものです！

おすすめ書籍（勉強開始時点の書籍最新版を購入しましょう）

https://book.impress.co.jp/books/1121101020

各カテゴリごとでまとめていますので隙間時間に見てみてください。

## ラムダ式
クラスに内包されていない変数に格納できる関数のこと、関数型プログラミングの概念が採用されている。
外部のオブジェクト変数を使用する場合、参照先は実質的にfinalになる。
変数に型がついていないのはvar型で表現されているため。
匿名クラスをさらに簡潔にしたもの(オーバライドするメソッドがわかればいいみたいな)

### 引数の型は省略可能
(x) -> x; 
### ()も省略可能
x -> x ; 
### 引数の型を記述する場合、()は省略できない
(String x) -> x ; 
### 引数が複数になる場合、引数の型は省略可能だが()は省略できない
(x,y) -> x + y; 
### ｛｝とreturnのどちらかがあってどちらかがない、というのはダメ

## 匿名クラス
インスタンス化時に関数型インタフェースをオーバーライドする等
```java
Test A = new Test() { system.out.print("あ") };
```

## メソッド参照
引数と戻り値が確定しているため、それを省いた書き方、変数に格納する
```java
(クラス名::メソッド名)
(インスタンス名::メソッド名)
() -> Math.random()
Math::random
```

## 関数型インタフェース
関数型インタフェースとは、抽象型メソッドをひとつだけ持っているもの(default,staticメソッドはあってもよい)
@ functionInterfaceをつけると関数型インタフェースであることをコンパイラに教えられる

**43個もあるが基本の7つを派生したものが多い**
### 関数型インタフェース一覧
※functionパッケージ T-引数、R-戻り値
※プリミティブは基本扱えないので注意

**Supplier<T>-T get()**
何も受け取らず処理結果を返す。

**Consumer<T>-void accept(T)**
**BiConsumer<T,U>-void accept(T,U)**
引数を受け取って処理をする。戻り値なし。

**Predicate<T>-boolean test(T)**
**BiPredicate<T,U>-boolean test(T,U)**
断定すると言う意味。引数（T）を受け取って評価する。
orメソッド(||),andメソッド(&&)がデフォルトメソッドとしてある、複数のPredicateを合成するためのもの。

**Function<T,R>-R apply(T)**
**BiFunction<T,U,R>-R apply(T,U)**
引数（T,U）を受け取って指定された型（R）の結果を返す。
andthenメソッドとcomposeメソッドがありひとつの処理として表現できる。
a.andthen(b)ではaが先に処理、a.compose(b)ならbが先に処理され引数の変更は継続される

**UnalyOperator<T>-T apply(T)**
**BinalyOperator<T>-T apply(T,T)**
単項演算子という意味。ひとつの値（T)を処理して同じ型（T)の結果を戻す、全て同じ型でなければならない

### langパッケージ
**Rannable-void run()**
スレッド実行処理の記述、thread()
匿名クラスで渡すとオーバーライド可能
戻り値がない

### util.cocurentパッケージ
**Callable<R>-R call()**
スレッド実行と処理結果を返す、例外スロー

### プリミティブな値を扱う場合
**ToDoubleFunction**
戻り値を戻す
**LongConsumer**
戻さない

## ストリーム
配列やコレクション(list,set)のデータ処理をラムダ式で表現できる方法

### 記述内容
最終的な結果 = ストリームオブジェクト.中間操作メソッド….終端操作メソッド
※終端操作が呼ばれた時に中間操作が呼ばれ、ストリームオブジェクトはクローズする

#### 中間操作メソッド一覧
中間メソッドはストリームを返す

| メソッド | 説明 |
|:-:|:-:|
|  of() | ストリームの生成  |
| distinct()  | 要素の重複を取り除く  |
|  filter() | 条件に一致するデータだけ  |
| limit()  | 指定した数まで  |
| map()  |  各データを変換し新しいｽﾄﾘｰﾑを生成 |
| peek()  | 中間結果を取得  |
| skip()  | 指定した数最初の要素を飛ばす  |
| sorted()  | 自然順序でソート  |
| flatToMapInt()  | 複数の1次元配列をint型ストリームの配列に合算変換 |

#### 終端操作メソッド一覧
| メソッド | 説明 |
|:-:|:-:|
| allmatch() |  全ての要素が一致するかboolean |
| anymatch()  | いずれかの要素が一致するかboolean  |
| collect()  |  コレクションを返す |
| count()  | 要素数を返す  |
|  findAny() | 要素が残っているかランダムの要素をOptionalで返す  |
|  findFirst() | 最初の要素のOptionalを返す  |
|  forEach() |  繰り返し処理 |
| max()  | 最大の要素を返す  |
| min()  | 最小の要素を返す  |
|  noneMatch() | 条件に一致しないか  |
|  reduce() |  累積結合、リストをひとつにまとめる。optionalが戻り値になる。第一引数があればその型が戻り値。 |
|  toArray(); |  配列を返す |

## Arrays.stream()
配列からストリームを作る

## ストリームオブジェクト一覧

### Stream<T>インタフェース
T型のデータ参照集合

**MapToXXX()**
プリミティブに変換する

### IntStreamインタフェース
int型
**average()**
数値の平均を求めて、OptionalDouble型を返す

### LongStreamインタフェース 
long型
### DoubleStreamインタフェース
double型

## OptionalDoubleクラス
**getAsDouble()**
結果の値をdouble型で返す

## 並列ストリーム
**parallelStream()**
複数のスレッドで一斉にストリームを処理

**forEachOrdered()**
ストリームの処理順を保証するがパフォーマンスは向上しない

## Collecterインタフェース
### Collecter<T,A,R>
ストリーム内の要素の型、処理途中の値保持オブジェクト、最終的な結果の型を引数に持つインタフェース
※下記を実装しなければならない※
※ほとんどFunction<T,A>
**supplier()**
処理途中のオブジェクトを生成する
supplierラムダを返す
**accumulator()**
実行したい処理を記述したBiConsumer型のラムダ式を返す
**combiner()**
BinaryOperater<T>で受け取り並列ストリームの内容を結合しT型を返す
**finisher()**
処理結果をもどすR型で返す

## Set<characteristics> characteristics()
CollecterのEnumセットを戻す。
**CONCURRENT**
並行処理をする
**IDENTITY_FINISH**
finisher()省略可能
**UNORDERED**
順序の維持を保証しない
**指定しないなら**
EnumSet.noneOf(Characteristics.class)

## averageDouble()
ストリームの要素をdouble型に変換し平均を求めることができる

## Collectorsクラス
リストを蓄積したり独自処理を入れるもの。
collectorインタフェースの実現クラス
使用例:ストリーム結果をリストにする
```java
.collect(Collectors.toList())
```

| メソッド名 | 説明 |
|:-:|:-:|
| toList()  | 新しいlistを返す  |
| toSet()  |  新しいsetを返す |
|  toMap() |  新しいmapを返す、第一引数と第二引数がfunctionラムダ |
|  groupingBy() |  指定した要素でグルーピングしてマップを返す(キーが戻り値、バリューがリスト)。第一引数でfunctionラムダを受けとる |
| summingInt()  |  グルーピングして合算intを返す |
|   summingLong()| グルーピングして合算longを返す  |
| summingDouble()  | グルーピングして合算doubleを返す  |
| partitioningBy()  | 条件ごとにtrueかfalseでグルーピングしてマップを返す(キーがtrueかfalse、バリューがリスト)  |
