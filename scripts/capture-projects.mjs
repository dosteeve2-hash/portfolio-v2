/* eslint-disable no-console */
// Captures neuves des vrais sites en ligne : posters WebP (bureau 1280x800 et mobile 390x844) et boucle de défilement
// (images capturées via CDP, assemblées par ffmpeg en WebM VP9 + MP4 H.264, 960x600, sans son).
// Usage : FFMPEG=<chemin ffmpeg> node scripts/capture-projects.mjs [slug...]
import { spawn, spawnSync } from 'node:child_process'
import { mkdirSync, rmSync, writeFileSync, statSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ICI = dirname(fileURLToPath(import.meta.url))
const OUT = join(ICI, '..', 'public', 'projects')
const TMP = join(process.env.TEMP ?? '.', 'portfolio-capture')
const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
const FFMPEG = process.env.FFMPEG ?? 'ffmpeg'
const PORT = 9371
const FPS = 20
const DURATION = 7

const SITES = {
  sugu: 'https://duka-kappa.vercel.app',
  milltrack: 'https://taama-mu.vercel.app',
  comptrack: 'https://comptrack-chi.vercel.app',
  valuechain: 'https://valuechain-connect.vercel.app',
  forja: 'https://forja-pied.vercel.app',
  indubot: 'https://indubot-afrika.vercel.app',
  burkinacollect: 'https://burkinacollect-bf.vercel.app',
  finegame: 'https://fine-game-three.vercel.app',
  agrotrack: 'https://agrotrack-bf.vercel.app',
  forge: 'https://forge-afrika.vercel.app',
  ueemt: 'https://ueemt-tokat.vercel.app',
  mifa: 'https://mifa-life-shop-9k55.vercel.app',
}
// Sites à écran unique : au lieu de défiler, on joue un court scénario (image -> script à exécuter dans la page).
const click = (re) => `[...document.querySelectorAll('button')].find((b) => ${re}.test(b.innerText))?.click()`
const SCENARIOS = {
  finegame: { 28: click(/Lancer la partie/i), 62: click(/Valider et jouer/i) },
}
const chosen = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(SITES)
const wait = (ms) => new Promise((r) => setTimeout(r, ms))
const ff = (args) => {
  const r = spawnSync(FFMPEG, ['-hide_banner', '-loglevel', 'error', '-y', ...args], { stdio: 'inherit' })
  if (r.status !== 0) throw new Error('ffmpeg a échoué')
}

mkdirSync(OUT, { recursive: true })
rmSync(TMP, { recursive: true, force: true })
mkdirSync(TMP, { recursive: true })
const profile = join(TMP, 'edge')
const proc = spawn(EDGE, ['--headless=new', '--disable-gpu', `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`, 'about:blank'], { stdio: 'ignore' })

async function connect() {
  for (let i = 0; i < 40; i++) {
    try {
      const list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json()
      const page = list.find((x) => x.type === 'page')
      if (page) {
        const ws = new WebSocket(page.webSocketDebuggerUrl)
        await new Promise((r) => ws.addEventListener('open', r, { once: true }))
        return ws
      }
    } catch { /* démarrage */ }
    await wait(500)
  }
  throw new Error('Edge ne répond pas')
}
const ws = await connect()
let seq = 0
const pending = new Map()
ws.addEventListener('message', (m) => {
  const d = JSON.parse(m.data)
  if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id) }
})
const cmd = (method, params = {}) => new Promise((res) => { const n = ++seq; pending.set(n, res); ws.send(JSON.stringify({ id: n, method, params })) })
const ev = async (expression) => (await cmd('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })).result?.result?.value
await cmd('Page.enable'); await cmd('Runtime.enable')
// Pages dans la langue du portfolio (français par défaut) quand le site détecte la langue.
await cmd('Emulation.setUserAgentOverride', { userAgent: await ev('navigator.userAgent'), acceptLanguage: 'fr-FR,fr' })

const shot = async (file, format = 'png', quality = 85) => {
  const r = await cmd('Page.captureScreenshot', { format, quality, fromSurface: true })
  writeFileSync(file, Buffer.from(r.result.data, 'base64'))
}
const kb = (f) => Math.round(statSync(f).size / 1024)
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
const meta = {}

for (const slug of chosen) {
  const url = SITES[slug]
  if (!url) continue
  const dir = join(TMP, slug)
  mkdirSync(dir, { recursive: true })
  console.log(`== ${slug} ${url}`)

  // mobile
  await cmd('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true })
  await cmd('Page.navigate', { url })
  await wait(5500)
  await shot(join(dir, 'm.png'))
  ff(['-i', join(dir, 'm.png'), '-c:v', 'libwebp', '-quality', '72', '-compression_level', '6', join(OUT, `${slug}-m.webp`)])

  // bureau
  await cmd('Emulation.setDeviceMetricsOverride', { width: 1280, height: 800, deviceScaleFactor: 1, mobile: false })
  await cmd('Page.navigate', { url })
  await wait(5500)
  meta[slug] = await ev(`({ title: document.title, description: document.querySelector('meta[name=description]')?.content ?? '', h1: document.querySelector('h1')?.innerText ?? '', height: document.documentElement.scrollHeight })`)
  await shot(join(dir, 'd.png'))
  ff(['-i', join(dir, 'd.png'), '-vf', 'scale=960:600:flags=lanczos', '-c:v', 'libwebp', '-quality', '76', '-compression_level', '6', join(OUT, `${slug}-d.webp`)])

  // passe rapide pour déclencher les révélations au défilement, puis retour en haut
  const total = meta[slug].height ?? 800
  const maxY = Math.max(0, Math.min(total - 800, 1800))
  for (let y = 0; y <= total; y += 500) { await ev(`window.scrollTo(0, ${y})`); await wait(120) }
  await ev('window.scrollTo(0, 0)')
  await wait(1200)

  // boucle aller-retour
  const scenario = SCENARIOS[slug]
  const frames = FPS * DURATION
  const hold = Math.round(FPS * 0.8)
  const travel = (frames - 2 * hold) / 2
  for (let i = 0; i < frames; i++) {
    let p
    if (i < hold) p = 0
    else if (i < hold + travel) p = ease((i - hold) / travel)
    else if (i < hold + travel + hold) p = 1
    else p = 1 - ease((i - hold - travel - hold) / travel)
    if (scenario) { if (scenario[i]) await ev(scenario[i]) } else await ev(`window.scrollTo(0, ${Math.round(p * maxY)})`)
    await wait(70)
    await shot(join(dir, `f${String(i).padStart(3, '0')}.jpg`), 'jpeg', 82)
  }
  const inp = ['-framerate', String(FPS), '-i', join(dir, 'f%03d.jpg'), '-vf', 'scale=960:600:flags=lanczos']
  ff([...inp, '-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', '44', '-cpu-used', '4', '-row-mt', '1', '-an', '-pix_fmt', 'yuv420p', join(OUT, `${slug}.webm`)])
  ff([...inp, '-c:v', 'libx264', '-crf', '30', '-preset', 'slow', '-movflags', '+faststart', '-an', '-pix_fmt', 'yuv420p', join(OUT, `${slug}.mp4`)])
  console.log(`   d.webp ${kb(join(OUT, `${slug}-d.webp`))} Ko · m.webp ${kb(join(OUT, `${slug}-m.webp`))} Ko · webm ${kb(join(OUT, `${slug}.webm`))} Ko · mp4 ${kb(join(OUT, `${slug}.mp4`))} Ko`)
  rmSync(dir, { recursive: true, force: true })
}
writeFileSync(join(TMP, 'meta.json'), JSON.stringify(meta, null, 2))
console.log(JSON.stringify(meta, null, 2))
ws.close(); proc.kill()
