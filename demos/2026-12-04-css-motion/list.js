// 一覧ページ（index.html）の描画と並べ替え
import { items } from './items.js'

const grid = document.querySelector('#grid')

const render = (list) => {
  grid.innerHTML = list
    .map(
      (it) => `
      <li class="item" style="--vt-item: item-${it.id}; --vt: card-${it.id}; --vt-title: title-${it.id}">
        <a href="./detail.html?id=${it.id}">
          <div class="swatch" style="--h: ${it.hue}"></div>
          <h2>${it.name}</h2>
          <p>hue ${it.hue}</p>
        </a>
      </li>`,
    )
    .join('')
}

let current = [...items]
render(current)

const sorters = {
  hue: (l) => [...l].sort((a, b) => a.hue - b.hue),
  name: (l) => [...l].sort((a, b) => a.name.localeCompare(b.name, 'ja')),
  shuffle: (l) => [...l].sort(() => Math.random() - 0.5),
}

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)')

document.querySelectorAll('[data-sort]').forEach((btn) => {
  btn.addEventListener('click', () => {
    current = sorters[btn.dataset.sort](current)
    // ③ DOM を書き換える処理を包むだけで、前後の差分をブラウザがアニメーションしてくれる
    //    未対応ブラウザや、動きを減らす設定の人には普通に書き換えるだけ
    if (!document.startViewTransition || reduceMotion.matches) {
      window.explainLog?.(
        reduceMotion.matches ? '動きを減らす設定のため、遷移なしで書き換えました' : 'このブラウザは View Transitions に未対応のため、遷移なしで書き換えました',
        true,
      )
      return render(current)
    }
    const t = document.startViewTransition(() => render(current))
    window.explainTransition?.(t, `並べ替え（${btn.textContent}）`)
  })
})
