// 「仕組みを見る」モードの共通部分。各ページの <head> で普通の <script>（module ではない）として読み込む。
// - 描画前に html[data-explain] を付ける（別ページへの遷移でも、遷移先の最初の描画から効かせるため）
// - ナビに切り替えボタンを置く
// - View Transition の進行を記録してパネルに出す（window.explainTransition）
;(() => {
  const KEY = 'css-motion-explain'
  const read = () => {
    try { return localStorage.getItem(KEY) === '1' } catch { return false }
  }
  const write = (on) => {
    try { localStorage.setItem(KEY, on ? '1' : '0') } catch {}
  }

  const root = document.documentElement
  if (read()) root.dataset.explain = ''

  const isOn = () => 'explain' in root.dataset

  // ---- パネル ----
  let panel
  const ensurePanel = () => {
    if (panel) return panel
    panel = document.createElement('aside')
    panel.className = 'explain-panel'
    // 読み上げるのはログだけ（スクロールの表は頻繁に変わるので live 領域にしない）
    panel.setAttribute('aria-labelledby', 'explain-title')
    panel.innerHTML =
      '<h2 id="explain-title">仕組み</h2><p class="intro"></p><ol class="log" role="log"></ol><div class="extra"></div>'
    panel.querySelector('.intro').textContent = document.body.dataset.explainIntro ?? ''
    document.body.append(panel)
    return panel
  }
  const log = (text, reset = false) => {
    if (!isOn() || !document.body) return
    const ol = ensurePanel().querySelector('.log')
    if (reset) ol.innerHTML = ''
    const li = document.createElement('li')
    li.textContent = text
    ol.append(li)
  }
  window.explainLog = log
  window.explainExtra = (html) => {
    if (!isOn() || !document.body) return
    ensurePanel().querySelector('.extra').innerHTML = html
  }

  // 疑似要素のアニメーションから、作られた group の名前を集める
  const groupNames = () => {
    const names = new Set()
    for (const a of document.getAnimations()) {
      const m = a.effect?.pseudoElement?.match(/^::view-transition-group\((.+)\)$/)
      if (m && m[1] !== 'explain-panel') names.add(m[1])
    }
    return [...names]
  }

  // View Transition 1 回分の進行を記録する
  // crossDocument: 別ページから来た場合。撮影は前のページで済んでいて、② は「新しいページの準備完了」になる
  // 連打で前の遷移が中止されたとき、古い遷移のログが新しいログに混ざらないよう世代番号で区別する
  let gen = 0
  window.explainTransition = (t, label, crossDocument = false) => {
    if (!isOn() || !t) return
    const my = ++gen
    const mine = (fn) => (...args) => my === gen && fn(...args)
    const t0 = performance.now()
    const ms = () => `${Math.round(performance.now() - t0)}ms`
    let aborted = false
    log(
      crossDocument
        ? `① ${label}: 前のページで、切り替わる直前（pageswap）に撮影済み`
        : `① ${label}: 今の見た目を撮影`,
      true,
    )
    t.updateCallbackDone
      .then(mine(() => log(crossDocument ? '② 新しいページの最初の描画の準備ができた' : `② DOM の書き換え完了（${ms()}）`)))
      .catch(() => {})
    t.ready
      .then(
        mine(() => {
          log(`③④ 疑似要素の層を作成し、補間を開始（${ms()}）`)
          const names = groupNames()
          const extra = ensurePanel().querySelector('.extra')
          const p = document.createElement('p')
          p.textContent = `作られた group（${names.length} 個）`
          const ul = document.createElement('ul')
          ul.className = 'names'
          for (const n of names) {
            const li = document.createElement('li')
            const code = document.createElement('code')
            code.textContent = n
            li.append(code)
            ul.append(li)
          }
          extra.replaceChildren(p, ul)
        }),
      )
      .catch(
        mine((e) => {
          aborted = true
          log(`× 遷移は中止されました（${e.name}）`)
        }),
      )
    t.finished
      .then(mine(() => log(aborted ? '⑤ 遷移なしで新しい DOM を表示' : `⑤ 層を消して本物の DOM を表示（${ms()}）`)))
      .catch(() => {})
  }

  // 別ページから遷移してきたとき（新しいページの最初の描画の直前に発火）
  addEventListener('pagereveal', (e) => {
    if (e.viewTransition) window.explainTransition(e.viewTransition, '前のページから遷移', true)
  })

  // ---- 切り替えボタン ----
  addEventListener('DOMContentLoaded', () => {
    const nav = document.querySelector('nav.top')
    if (!nav) return
    const btn = document.createElement('button')
    btn.type = 'button'
    btn.className = 'explain-toggle'
    btn.textContent = '仕組みを見る'
    btn.setAttribute('aria-pressed', String(isOn()))
    btn.addEventListener('click', () => {
      const on = !isOn()
      if (on) root.dataset.explain = ''
      else delete root.dataset.explain
      btn.setAttribute('aria-pressed', String(on))
      write(on)
      if (on) {
        ensurePanel()
        log(document.body.dataset.explainIntro ? 'オンにしました' : 'オンにしました。デモを操作すると、ここに裏で起きていることが出ます', true)
      } else {
        panel?.remove()
        panel = null
      }
      dispatchEvent(new CustomEvent('explainchange', { detail: on }))
    })
    nav.append(btn)
    if (isOn()) {
      ensurePanel()
      if (!panel.querySelector('.log li') && !document.body.dataset.explainIntro) log('デモを操作すると、ここに裏で起きていることが出ます')
    }
  })
})()
