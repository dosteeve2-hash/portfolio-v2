// Généré par scripts/make_intro_audio.py à partir de content/intro-voice.json : ne pas modifier à la main.
// TODO relecture TR : texte turc à faire relire par un locuteur natif.
import type { IntroTimeline } from './introTypes'

export const introTimelineTr: IntroTimeline = {
  "locale": "tr",
  "audio": "/intro/voice-tr.mp3",
  "voice": "tr-TR-AhmetNeural",
  "rate": "+10%",
  "duration": 6.816,
  "marks": {"name": 2.421, "role1": 2.898, "role2": 3.966},
  "sentences": [
    {"start": 0.095, "end": 1.641},
    {"start": 1.943, "end": 4.591},
    {"start": 4.895, "end": 6.691},
  ],
  "words": [
    {"text": "Dünyama", "start": 0.095, "end": 0.845, "sentence": 0},
    {"text": "hoş", "start": 0.845, "end": 1.095, "sentence": 0},
    {"text": "geldiniz.", "start": 1.095, "end": 1.641, "sentence": 0},
    {"text": "Ben", "start": 1.943, "end": 2.193, "sentence": 1},
    {"text": "Donald;", "start": 2.421, "end": 2.728, "sentence": 1},
    {"text": "yazılım", "start": 2.898, "end": 3.353, "sentence": 1},
    {"text": "mühendisi", "start": 3.353, "end": 3.853, "sentence": 1},
    {"text": "ve", "start": 3.853, "end": 3.966, "sentence": 1},
    {"text": "üreticiyim.", "start": 3.966, "end": 4.591, "sentence": 1},
    {"text": "Neler", "start": 4.895, "end": 5.452, "sentence": 2},
    {"text": "geliştirdiğimi", "start": 5.452, "end": 6.1, "sentence": 2},
    {"text": "keşfedin.", "start": 6.1, "end": 6.691, "sentence": 2},
  ],
}
