---
title: 【React】React18からアンマウント後のstate警告が消えた話
tags:
  - React
private: false
updated_at: '2024-10-15T21:28:34+09:00'
id: 196eb6d378acacf11efe
organization_url_name: potato-salad
slide: false
ignorePublish: false
posting_campaign_uuid: null
agreed_posting_campaign_term: false
---
# async/await内でのAPI呼び出し中にアンマウントが起きるとどうなるか
下記を参照。（認識間違いがあればご意見いただけると幸いです。）

https://github.com/reactwg/react-18/discussions/82

アンマウント後にsetState関数が動くと今までは下記の警告が出ていたとのこと。
存在しないStateは更新できない。
```
Warning: Can't perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application. To fix, cancel all subscriptions and asynchronous tasks in a useEffect cleanup function.
```

対処法としては、マウントを管理できる変数などを用意し、実行処理の分岐を作ることだった。
ただし、これは警告を抑制するだけで、実際の問題は解決していなかったとのことです。
```react
let isMountedRef = useRef(false)
useEffect(() => {
  isMountedRef.current = true
  return () => {
    isMountedRef.current = false
  }
}, [])

async function handleSubmit() {
  setPending(true)
  await post('/someapi')
  if (!isMountedRef.current) {
    setPending(false)
  }
}
```
引用：https://github.com/reactwg/react-18/discussions/82


現在は、isMountedのような変数は消しても警告は出ないとのこと
```react
async function handleSubmit() {
  setPending(true)
  await post('/someapi') // component might unmount while we're waiting
  setPending(false)
}
```
引用：https://github.com/reactwg/react-18/discussions/82

