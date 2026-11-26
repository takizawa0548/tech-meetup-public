// デモ 2 の「仕組みを見る」: スクロール連動アニメーションの進み具合を数字で見せる
// タイムライン上の位置（スクロール量・見え具合）と、アニメーションの進み具合の 2 つを並べる
const targets = [
  { el: document.querySelector('.progress'), label: '① 読了バー', kind: 'scroll(root)' },
  ...[...document.querySelectorAll('.reveal')].map((el, i) => ({ el, label: `② カード ${i + 1}`, kind: 'view()' })),
  { el: document.querySelector('.parallax .bg'), label: '③ パララックス背景', kind: 'view()' },
  { el: document.querySelector('.strip'), label: '④ 横送り', kind: '--strip' },
]

const pct = (v) => (v == null ? '—' : `${Math.round(v * 100)}%`)
// view() のタイムラインは「入り始め 0% 〜 出きる 100%」。範囲外は分かる言葉にする
const timelinePos = (a, isView) => {
  const t = a?.timeline?.currentTime
  if (!(t && typeof t === 'object' && 'value' in t)) return '—'
  const v = Math.round(t.value)
  if (isView && v < 0) return 'まだ画面の下'
  if (isView && v > 100) return '画面の上へ出た'
  return `${v}%`
}

// カードにはバッジを直接付ける
const badges = new Map()
for (const t of targets) {
  if (!t.el?.classList.contains('reveal')) continue
  const b = document.createElement('span')
  b.className = 'explain-badge card-badge'
  b.setAttribute('aria-hidden', 'true') // パネルと同じ内容なので読み上げない
  t.el.append(b)
  badges.set(t.el, b)
}

let raf = 0
let last = ''
const tick = () => {
  const rows = targets.map((t) => {
    const a = t.el?.getAnimations()[0]
    if (!a) return `<tr><th>${t.label}</th><td colspan="2">停止中（未対応 or 動きを減らす設定）</td></tr>`
    const pos = timelinePos(a, t.kind !== 'scroll(root)')
    const prog = pct(a.effect.getComputedTiming().progress)
    const b = badges.get(t.el)
    const text = `タイムライン ${pos} → 進み ${prog}`
    if (b && b.textContent !== text) b.textContent = text
    return `<tr><th>${t.label}</th><td><code>${t.kind}</code> ${pos}</td><td>${prog}</td></tr>`
  })
  const html =
    `<table class="tl-table"><thead><tr><th></th><th>タイムライン上の位置</th><th>進み</th></tr></thead><tbody>${rows.join('')}</tbody></table>
     <p class="hint">「位置」はスクロール量・見え具合。<code>animation-range</code> の区間に入ったところだけ「進み」が 0% → 100% に変わります。</p>`
  // 値が変わったときだけ書き換える（毎フレーム DOM を作り直さない）
  if (html !== last) window.explainExtra?.((last = html))
  raf = requestAnimationFrame(tick)
}

const sync = () => {
  cancelAnimationFrame(raf)
  last = ""
  const on = 'explain' in document.documentElement.dataset
  for (const b of badges.values()) b.hidden = !on
  if (on) tick()
}
addEventListener('explainchange', sync)
sync()
