/* eslint-disable no-console */
// Contrôles et captures du mouvement (Edge headless piloté par CDP ; ffmpeg pour les vidéos d'aperçu).
//   node scripts/capture-motion.mjs shots  <dossier> [url]   captures bureau 1280 et mobile 375 à plusieurs positions de défilement
//   node scripts/capture-motion.mjs video  <dossier> [url]   vidéos de défilement (bureau et mobile), MP4
//   node scripts/capture-motion.mjs check  [url]             erreurs de console, mouvement réduit, étiquettes, mesures de mise en page
// Variables : FFMPEG (chemin de ffmpeg), URL de base par défaut http://localhost:3100/fr
import { spawn, spawnSync } from 'node:child_process'
import { mkdirSync, writeFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
const FFMPEG = process.env.FFMPEG ?? 'C:/Users/pc/Tools/ffmpeg-static/node_modules/ffmpeg-static/ffmpeg.exe'
const PORT = 9372
const [, , mode = 'check', arg1, arg2] = process.argv
const outDir = mode === 'check' ? null : arg1
const BASE = (mode === 'check' ? arg1 : arg2) ?? 'http://localhost:3100/fr'
const wait = (ms) => new Promise((r) => setTimeout(r, ms))

const tmp = join(process.env.TEMP ?? '.', 'capture-motion-' + Date.now())

mkdirSync(tmp, { recursive: true })
if (outDir) mkdirSync(outDir, { recursive: true })

const proc = spawn(EDGE, ['--headless=new', '--disable-gpu', `--remote-debugging-port=${PORT}`, `--user-data-dir=${join(tmp, 'profile')}`, 'about:blank'], { stdio: 'ignore' })
process.on('exit', () => proc.kill())

async function connect() {
  for (let i = 0; i < 120; i++) {
    try {
      const list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json()
      const page = list.find((x) => x.type === 'page')
      if (page) {
        const ws = new WebSocket(page.webSocketDebuggerUrl)
        await new Promise((r) => ws.addEventListener('open', r, { once: true }))
        return ws
      }
    } catch {
      /* démarrage */
    }
    await wait(400)
  }
  throw new Error('Edge ne répond pas')
}

const ws = await connect()
let seq = 0
const pending = new Map()
const listeners = []
ws.addEventListener('message', (m) => {
  const d = JSON.parse(m.data)
  if (d.id && pending.has(d.id)) {
    pending.get(d.id)(d)
    pending.delete(d.id)
  } else if (d.method) listeners.forEach((fn) => fn(d))
})
const cmd = (method, params = {}) =>
  new Promise((res) => {
    const n = ++seq
    pending.set(n, res)
    ws.send(JSON.stringify({ id: n, method, params }))
  })
const ev = async (expression) => (await cmd('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })).result?.result?.value
const errors = []
listeners.push((d) => {
  if (d.method === 'Runtime.exceptionThrown') errors.push(`exception: ${d.params.exceptionDetails.exception?.description ?? d.params.exceptionDetails.text}`)
  if (d.method === 'Runtime.consoleAPICalled' && ['error', 'warning'].includes(d.params.type)) errors.push(`${d.params.type}: ${d.params.args.map((a) => a.value ?? a.description).join(' ')}`)
  if (d.method === 'Log.entryAdded' && ['error'].includes(d.params.entry.level)) errors.push(`log: ${d.params.entry.text} ${d.params.entry.url ?? ''}`)
})
await cmd('Page.enable')
await cmd('Runtime.enable')
await cmd('Log.enable')

const DESKTOP = { width: 1280, height: 800, deviceScaleFactor: 1, mobile: false }
const MOBILE = { width: 375, height: 812, deviceScaleFactor: 2, mobile: true }

async function open(device, { intro = false, reduced = false, url = BASE } = {}) {
  await cmd('Emulation.setDeviceMetricsOverride', device)
  await cmd('Emulation.setTouchEmulationEnabled', { enabled: device.mobile })
  await cmd('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: reduced ? 'reduce' : 'no-preference' }] })
  await cmd('Page.navigate', { url: 'about:blank' })
  await cmd('Page.navigate', { url })
  await wait(1500)
  await ev(`sessionStorage.setItem('forge-intro-seen', '${intro ? '0' : '1'}'); sessionStorage.removeItem('forge-voice-played')`)
  await cmd('Page.navigate', { url })
  await wait(intro ? 600 : 3500)
}

const shot = async (file) => {
  const r = await cmd('Page.captureScreenshot', { format: 'png', fromSurface: true })
  writeFileSync(file, Buffer.from(r.result.data, 'base64'))
}

const wheel = (deltaY, x = 640, y = 400) => cmd('Input.dispatchMouseEvent', { type: 'mouseWheel', x, y, deltaX: 0, deltaY })

async function scrollToSelector(sel, offset = 0) {
  await ev(`(() => { const el = document.querySelector(${JSON.stringify(sel)}); if (el) window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY + ${offset}); return !!el })()`)
  await wait(1100)
}

async function shots() {
  for (const [name, device] of [['bureau', DESKTOP], ['mobile', MOBILE]]) {
    await open(device)
    await shot(join(outDir, `${name}-01-accueil.png`))
    await scrollToSelector('section[aria-label]', -120)
    await shot(join(outDir, `${name}-02-bandeau.png`))
    await scrollToSelector('#projects', 0)
    await shot(join(outDir, `${name}-03-projets-titre.png`))
    for (const [i, f] of [[4, 0.1], [5, 0.4], [6, 0.7], [7, 0.97]]) {
      const pos = await ev(`(() => { const s = document.querySelector('#projects'); const scene = s.querySelector('[style*="height"]'); const r = scene.getBoundingClientRect(); const top = r.top + window.scrollY; const travel = r.height - window.innerHeight; window.scrollTo(0, top + travel * ${f}); return travel })()`)
      await wait(900)
      await shot(join(outDir, `${name}-0${i}-scene-${Math.round(f * 100)}.png`))
      void pos
    }
    await ev(`document.querySelector('#projects ul')?.scrollIntoView()`)
    await wait(1100)
    await shot(join(outDir, `${name}-08-cartes.png`))
    await scrollToSelector('#about')
    await shot(join(outDir, `${name}-09-apropos.png`))
  }
  console.log('captures écrites dans', outDir)
}

// --- vidéos : screencast CDP -> ffmpeg ---
async function record(device, name, steps) {
  const dir = join(tmp, name)
  mkdirSync(dir, { recursive: true })
  const frames = []
  const onFrame = async (d) => {
    if (d.method !== 'Page.screencastFrame') return
    const file = join(dir, `f${String(frames.length).padStart(5, '0')}.jpg`)
    writeFileSync(file, Buffer.from(d.params.data, 'base64'))
    frames.push({ file, t: d.params.metadata.timestamp })
    await cmd('Page.screencastFrameAck', { sessionId: d.params.sessionId })
  }
  listeners.push(onFrame)
  await cmd('Page.startScreencast', { format: 'jpeg', quality: 72, maxWidth: device.width, maxHeight: device.height, everyNthFrame: 1 })
  await steps()
  await cmd('Page.stopScreencast')
  listeners.splice(listeners.indexOf(onFrame), 1)
  if (frames.length < 2) throw new Error('aucune image reçue')
  const list = frames.map((f, i) => `file '${f.file.replaceAll('\\', '/')}'\nduration ${Math.max(0.016, (frames[i + 1]?.t ?? f.t + 0.1) - f.t).toFixed(3)}`).join('\n')
  writeFileSync(join(dir, 'list.txt'), list + `\nfile '${frames.at(-1).file.replaceAll('\\', '/')}'\n`)
  const out = join(outDir, `${name}.mp4`)
  const r = spawnSync(FFMPEG, ['-hide_banner', '-loglevel', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', join(dir, 'list.txt'), '-vf', 'fps=30,scale=trunc(iw/2)*2:trunc(ih/2)*2', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '28', '-preset', 'veryfast', '-movflags', '+faststart', out], { stdio: 'inherit' })
  if (r.status !== 0 || !existsSync(out)) throw new Error('ffmpeg a échoué')
  console.log(name, frames.length, 'images ->', out)
}

async function smoothWheel(total, ms, x, y) {
  const t0 = Date.now()
  let sent = 0
  while (Date.now() - t0 < ms) {
    const target = (total * (Date.now() - t0)) / ms
    const d = Math.round(target - sent)
    if (d !== 0) await wheel(d, x, y)
    sent += d
    await wait(16)
  }
}

async function video() {
  await open(DESKTOP)
  await record(DESKTOP, 'apercu-bureau', async () => {
    await cmd('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 900, y: 300 })
    await wait(600)
    // glisser une étiquette du héros
    const pos = await ev(`(() => { const s = [...document.querySelectorAll('[role=button][aria-roledescription]')].find((n) => n.getBoundingClientRect().width > 0); if (!s) return null; const r = s.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2] })()`)
    if (pos) {
      await cmd('Input.dispatchMouseEvent', { type: 'mousePressed', x: pos[0], y: pos[1], button: 'left', clickCount: 1 })
      for (let i = 1; i <= 14; i++) {
        await cmd('Input.dispatchMouseEvent', { type: 'mouseMoved', x: pos[0] - i * 18, y: pos[1] + i * 9, button: 'left' })
        await wait(16)
      }
      await cmd('Input.dispatchMouseEvent', { type: 'mouseReleased', x: pos[0] - 252, y: pos[1] + 126, button: 'left', clickCount: 1 })
    }
    await wait(1500)
    await smoothWheel(7600, 11000, 640, 400)
    await wait(500)
  })
  await open(MOBILE)
  await record(MOBILE, 'apercu-mobile', async () => {
    await wait(900)
    // défilement tactile : la molette émulée sert de doigt
    await smoothWheel(6200, 9000, 187, 400)
    await wait(500)
  })
  console.log('vidéos écrites dans', outDir)
}

async function assistant() {
  for (const [name, device] of [['bureau', DESKTOP], ['mobile', MOBILE]]) {
    await open(device)
    await ev(`window.scrollTo(0, 600)`)
    await wait(1500)
    await ev(`document.dispatchEvent(new Event('pointermove'))`)
    await wait(6200)
    await shot(join(outDir, `assistant-${name}-1-bouton-infobulle.png`))
    await ev(`document.querySelector('button[aria-haspopup=dialog]').click()`)
    await wait(900)
    await shot(join(outDir, `assistant-${name}-2-ouvert.png`))
    await ev(`[...document.querySelectorAll('[role=dialog] button')].find((b) => b.textContent.includes('projets') || b.textContent.includes('Tes'))?.click()`)
    await wait(250)
    await shot(join(outDir, `assistant-${name}-3-reponse-en-cours.png`))
    await wait(2600)
    await shot(join(outDir, `assistant-${name}-4-reponse.png`))
    const trap = await ev(`(() => { const d = document.querySelector('[role=dialog]'); const before = d.contains(document.activeElement); d.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })); return before })()`)
    await wait(500)
    console.log(name, 'focus dans le dialogue :', trap, '| dialogue fermé :', !(await ev(`!!document.querySelector('[role=dialog]')`)), '| focus rendu au bouton :', await ev(`document.activeElement?.getAttribute('aria-haspopup') === 'dialog'`))
  }
}

async function cls() {
  await cmd('Emulation.setDeviceMetricsOverride', MOBILE)
  await cmd('Emulation.setEmulatedMedia', { features: [] })
  await cmd('Page.navigate', { url: 'about:blank' })
  await cmd('Page.addScriptToEvaluateOnNewDocument', { source: `window.__ls = []; new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__ls.push({ v: e.value, t: Math.round(e.startTime), s: e.sources.map((x) => ({ n: x.node?.nodeName + '.' + (x.node?.className || '').toString().slice(0, 40), p: [x.previousRect.y, x.previousRect.height], c: [x.currentRect.y, x.currentRect.height] })) }) }).observe({ type: 'layout-shift', buffered: true })` })
  await cmd('Page.navigate', { url: BASE })
  await wait(6000)
  console.log(JSON.stringify(await ev('JSON.stringify(window.__ls)'), null, 1))
}

async function check() {
  const report = {}
  await open(DESKTOP)
  report.bureau = await ev(`({
    stickers: document.querySelectorAll('[role=button][aria-roledescription]').length,
    marquee: !!document.querySelector('section[aria-label] [style*="max-content"]'),
    lenis: document.documentElement.classList.contains('lenis'),
    scrollHeight: document.documentElement.scrollHeight,
    overflowX: document.documentElement.scrollWidth > innerWidth,
    gridLayers: document.querySelectorAll('[aria-hidden=true][style*="z-index: -1"]').length,
  })`)
  await wait(2500)
  report.bureau.lenisAfterIdle = await ev(`document.documentElement.classList.contains('lenis')`)
  report.bureau.media = await ev(`JSON.stringify({ coarse: matchMedia('(hover: none), (pointer: coarse)').matches, reduced: matchMedia('(prefers-reduced-motion: reduce)').matches, cls: document.documentElement.className })`)
  await open(MOBILE)
  report.mobile = await ev(`({ lenis: document.documentElement.classList.contains('lenis'), overflowX: document.documentElement.scrollWidth > innerWidth, stickers: document.querySelectorAll('[role=button][aria-roledescription]').length })`)
  await open(DESKTOP, { reduced: true })
  await scrollToSelector('#projects', 0)
  report.reduit = await ev(`({
    lenis: document.documentElement.classList.contains('lenis'),
    sceneSticky: !!document.querySelector('#projects [style*="sticky"]'),
    hiddenReveals: [...document.querySelectorAll('[style*="opacity: 0"]')].map((n) => n.tagName + "." + String(n.className).slice(0, 50)),
    counters: [...document.querySelectorAll('dd span[aria-hidden]')].map((n) => n.textContent),
  })`)
  report.erreurs = errors
  console.log(JSON.stringify(report, null, 2))
}

try {
  if (mode === 'shots') await shots()
  else if (mode === 'video') await video()
  else if (mode === 'assistant') await assistant()
  else if (mode === 'cls') await cls()
  else await check()
} finally {
  proc.kill()
  process.exit(0)
}
