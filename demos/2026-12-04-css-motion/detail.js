// 詳細ページ（detail.html）の中身を入れる。描画前に実行される（blocking="render"）
import { items } from './items.js'

const id = new URLSearchParams(location.search).get('id')
// 存在しない id のときも、表示する項目と遷移の名前が食い違わないよう、先に項目を決める
const it = items.find((x) => x.id === id) ?? items[0]

const root = document.documentElement.style
root.setProperty('--vt', `card-${it.id}`)
root.setProperty('--vt-title', `title-${it.id}`)

document.querySelector('#hero').style.setProperty('--h', it.hue)
document.querySelector('#title').textContent = it.name
document.querySelector('#text').textContent = it.text
document.title = `デモ 1: ${it.name}`
