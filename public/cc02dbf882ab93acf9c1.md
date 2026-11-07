---
title: TypeScript勉強してみた⑦
tags:
  - TypeScript
private: false
updated_at: '2024-06-01T16:01:29+09:00'
id: cc02dbf882ab93acf9c1
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

**「いいね」か「ブックマーク」**
を頂けると僕のモチベーションアップになります！:thumbsup:
少しでも気に入っていただけたらよろしくお願いいたします！:thumbsup:


# 今回の目的
TypeScriptがわからなくてやばたにえんなので、ハンドブックで学んでみました。
（前回）

https://qiita.com/mr_noppo/items/71f18d8c73ecff7e4c47

# 主に参考にさせていただいた記事

https://www.typescriptlang.org/docs/handbook/intro.html

# 関数の詳細
### 関数型
typeで関数の型を定義できます。
```ts
// 関数を引数で受け取る型定義
// stringの引数を受け取り、stringを返します。
function greeter(fn: (a: string) => string) {
  return fn("Hello, World");
}
 
function printToConsole(s: string) {
  return s;
}
 
console.log(greeter(printToConsole));
```
typeで定義ももちろん可能です。
```ts
type GreetFunction = (a: string) => void;
```

※関数のプロパティ
自由に追加できます。
```ts
function myFunc(someArg: number) {
  return someArg > 3;
}
myFunc.description = "default description";
myFunc.a = "a";
```

### 汎用関数
下記の場合、引数と戻し値ともにanyとなります。
```ts
function firstElement(arr: any[]) {
  return arr[0];
}
```
下記の場合、ジェネリクスに定義した型が採用されます。
```ts
function firstElement<Type>(arr: Type[]): Type | undefined {
  return arr[0];
}
```
ジェネリクスを使用することで型を定義できます。TypeScriptの推測でもメソッドは使用可能です。
```ts
// s is of type 'string'
const s = firstElement<string>(["a", "b", "c"]);
// n is of type 'number'
const n = firstElement<number>([1, 2, 3]);
// u is of type 'any'
const u = firstElement<any>([]);
```

### 汎用関数をpropertyの有無により制限する(extends)
extends{~:~}を使用することにより、該当のpropertyにアクセスできる型のみに制限することが可能です。
```ts
function longest<Type extends { length: number }>(a: Type, b: Type) {
  if (a.length >= b.length) {
    return a;
  } else {
    return b;
  }
}
 
// longerArray is of type 'number[]'
const longerArray = longest([1, 2], [1, 2, 3]);
// longerString is of type 'alice' | 'bob'
const longerString = longest("alice", "bob");
```

### Type型との不一致
下記の場合、else文でエラーが発生します。
Typeと同じようにプロパティを持っている想定になりますが、Typeとの関連性がなく、Typeが他のプロパティも持っている可能性があることから、別のインスタンスが生成される可能性を警告される為です。
```ts
function minimumLength<Type extends { length: number }>(
  obj: Type,
  minimum: number
): Type {
  if (obj.length >= minimum) {
    return obj;
  } else {
    return { length: minimum };
  }
}
```

# 次回の予定
https://qiita.com/mr_noppo/items/57fe7b35b047b1535f41
