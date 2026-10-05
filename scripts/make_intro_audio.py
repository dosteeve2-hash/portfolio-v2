"""Voix off de l'intro (FR / EN / TR) et chronologie mot à mot.

Source des textes et des voix : content/intro-voice.json
Sorties :
  public/intro/voice-<locale>.mp3      piste audio
  public/intro/voice-<locale>.vtt      sous-titres mot à mot
  content/introTimeline.<locale>.ts    chronologie lue par l'intro (mots, phrases, repères)

Usage :
  py -3.11 scripts/make_intro_audio.py                 génère les fichiers du site
  py -3.11 scripts/make_intro_audio.py --candidates D  compare les voix candidates dans le dossier D (rien n'est écrit dans le site)

Si edge-tts échoue (réseau), la chronologie est estimée et `audio` vaut null :
l'intro reste jouable sans voix, avec le même minutage.
"""

from __future__ import annotations

import asyncio
import json
import re
import sys
from dataclasses import dataclass
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CONFIG = ROOT / "content" / "intro-voice.json"
AUDIO_DIR = ROOT / "public" / "intro"
BYTES_PER_SECOND = 48000 / 8  # edge-tts : audio-24khz-48kbitrate-mono-mp3, débit constant
FRAME_BYTES = 144  # MPEG-2 couche III, 48 kbit/s, 24 kHz : trames de 576 échantillons
FRAME_SECONDS = 576 / 24000
SENTENCE_GAP = 0.2  # silence gardé après la dernière syllabe d'une phrase
FINAL_TAIL = 0.12
RATE_STEPS = ["+0%", "+5%", "+8%", "+10%"]


@dataclass
class Word:
    text: str
    start: float
    end: float


async def synthesize(text: str, voice: str, rate: str) -> tuple[bytes, list[Word]]:
    import edge_tts

    communicate = edge_tts.Communicate(text, voice, rate=rate, boundary="WordBoundary")
    audio = bytearray()
    words: list[Word] = []
    async for chunk in communicate.stream():
        if chunk["type"] == "audio":
            audio += chunk["data"]
        elif chunk["type"] == "WordBoundary":
            start = chunk["offset"] / 1e7
            words.append(Word(chunk["text"], start, start + chunk["duration"] / 1e7))
    if not audio or not words:
        raise RuntimeError("réponse vide")
    return bytes(audio), words


def duration_of(audio: bytes) -> float:
    return len(audio) / BYTES_PER_SECOND


def check_frames(audio: bytes) -> None:
    for offset in range(0, len(audio), FRAME_BYTES):
        if audio[offset] != 0xFF or (audio[offset + 1] & 0xE0) != 0xE0:
            raise RuntimeError("flux MP3 inattendu : découpe par trame impossible")


async def synthesize_sentences(text: str, voice: str, rate: str) -> tuple[bytes, list[Word]]:
    """Une synthèse par phrase, silence final raccourci à la trame près, puis assemblage.

    Le service insère de longues pauses entre les phrases (jusqu'à 1,1 s en turc) ;
    on les ramène à SENTENCE_GAP sans toucher au débit de la parole. Couper la fin
    d'un flux MP3 est sans risque (le réservoir de bits ne regarde qu'en arrière)
    et chaque segment recommence avec un réservoir vide, donc l'assemblage est propre.
    """
    sentences = [text[a:b].strip() for a, b in sentence_ranges(text)]
    audio = bytearray()
    words: list[Word] = []
    for index, sentence in enumerate(sentences):
        part, part_words = await synthesize(sentence, voice, rate)
        check_frames(part)
        tail = FINAL_TAIL if index == len(sentences) - 1 else SENTENCE_GAP
        keep = min(len(part) // FRAME_BYTES, int((part_words[-1].end + tail) / FRAME_SECONDS) + 1)
        offset = len(audio) / BYTES_PER_SECOND
        audio += part[: keep * FRAME_BYTES]
        words += [Word(w.text, w.start + offset, w.end + offset) for w in part_words]
    return bytes(audio), words


def sentence_ranges(text: str) -> list[tuple[int, int]]:
    ranges = []
    for match in re.finditer(r"[^.!?]+[.!?]?", text):
        if match.group().strip():
            start = match.start() + (len(match.group()) - len(match.group().lstrip()))
            ranges.append((start, match.end()))
    return ranges


def locate(text: str, words: list[Word]) -> list[int]:
    positions = []
    cursor = 0
    lowered = text.lower()
    for word in words:
        index = text.find(word.text, cursor)
        if index < 0:
            index = lowered.find(word.text.lower(), cursor)
        if index < 0:
            index = cursor
        positions.append(index)
        cursor = index + max(1, len(word.text))
    return positions


def estimate_words(text: str, total: float = 4.3) -> list[Word]:
    tokens = [m for m in re.finditer(r"\S+", text)]
    weights = [len(m.group()) + 2 for m in tokens]
    scale = total / sum(weights)
    words = []
    t = 0.05
    for match, weight in zip(tokens, weights):
        span = weight * scale
        words.append(Word(match.group().strip(".,;:!?"), t, t + span * 0.85))
        t += span
    return words


def build_timeline(locale: str, entry: dict, words: list[Word], duration: float, audio: bool, rate: str) -> dict:
    text: str = entry["text"]
    positions = locate(text, words)
    sentences = sentence_ranges(text)

    def sentence_of(index: int) -> int:
        for number, (start, end) in enumerate(sentences):
            if start <= index < end:
                return number
        return len(sentences) - 1

    out_words = []
    for i, (word, position) in enumerate(zip(words, positions)):
        stop = positions[i + 1] if i + 1 < len(positions) else len(text)
        shown = text[position:stop].strip()
        out_words.append(
            {"text": shown, "start": round(word.start, 3), "end": round(word.end, 3), "sentence": sentence_of(position)}
        )

    out_sentences = []
    for number in range(len(sentences)):
        members = [w for w in out_words if w["sentence"] == number]
        if members:
            out_sentences.append({"start": members[0]["start"], "end": members[-1]["end"]})

    marks = {}
    for key, phrase in entry["marks"].items():
        index = text.find(phrase)
        hit = next((w for w, p in zip(out_words, positions) if index >= 0 and p >= index), None)
        marks[key] = hit["start"] if hit else out_words[0]["start"]

    return {
        "locale": locale,
        "audio": f"/intro/voice-{locale}.mp3" if audio else None,
        "voice": entry["voice"] if audio else None,
        "rate": rate if audio else None,
        "duration": round(duration, 3),
        "marks": marks,
        "sentences": out_sentences,
        "words": out_words,
    }


def format_timeline(timeline: dict) -> str:
    def inline(value: object) -> str:
        return json.dumps(value, ensure_ascii=False, separators=(", ", ": "))

    newline = "\n"
    body = []
    for key, value in timeline.items():
        if isinstance(value, list):
            items = "".join(f"{newline}    {inline(item)}," for item in value)
            body.append(f'  "{key}": [{items}{newline}  ],')
        else:
            body.append(f'  "{key}": {inline(value)},')
    return "{" + newline + newline.join(body) + newline + "}"


def to_ts(timeline: dict) -> str:
    locale = timeline["locale"]
    name = f"introTimeline{locale.capitalize()}"
    lines = [
        "// Généré par scripts/make_intro_audio.py à partir de content/intro-voice.json : ne pas modifier à la main.",
    ]
    if locale == "tr":
        lines.append("// TODO relecture TR : texte turc à faire relire par un locuteur natif.")
    lines += [
        "import type { IntroTimeline } from './introTypes'",
        "",
        f"export const {name}: IntroTimeline = {format_timeline(timeline)}",
        "",
    ]
    return "\n".join(lines)


def to_vtt(timeline: dict) -> str:
    def stamp(seconds: float) -> str:
        minutes, sec = divmod(seconds, 60)
        return f"00:{int(minutes):02d}:{sec:06.3f}"

    cues = ["WEBVTT", ""]
    for word in timeline["words"]:
        cues += [f"{stamp(word['start'])} --> {stamp(max(word['end'], word['start'] + 0.05))}", word["text"], ""]
    return "\n".join(cues)


async def generate_site(config: dict) -> None:
    AUDIO_DIR.mkdir(parents=True, exist_ok=True)
    limit = float(config["maxSeconds"])
    for locale, entry in config["locales"].items():
        try:
            rate = entry.get("rate", "+0%")
            steps = [rate] + [r for r in RATE_STEPS if r != rate and int(r[1:-1]) > int(rate[1:-1])]
            for rate in steps:
                audio, words = await synthesize_sentences(entry["text"], entry["voice"], rate)
                duration = duration_of(audio)
                if duration <= limit:
                    break
            (AUDIO_DIR / f"voice-{locale}.mp3").write_bytes(audio)
            timeline = build_timeline(locale, entry, words, duration, True, rate)
            print(f"{locale}: {entry['voice']} {rate} {duration:.2f} s, {len(words)} mots")
        except Exception as error:  # réseau ou service indisponible : intro sans voix
            print(f"{locale}: edge-tts a échoué ({error}) -> chronologie estimée, sans voix", file=sys.stderr)
            words = estimate_words(entry["text"])
            timeline = build_timeline(locale, entry, words, words[-1].end + 0.2, False, "+0%")
        (ROOT / "content" / f"introTimeline.{locale}.ts").write_text(to_ts(timeline), encoding="utf-8")
        (AUDIO_DIR / f"voice-{locale}.vtt").write_text(to_vtt(timeline), encoding="utf-8")


async def compare_candidates(config: dict, out_dir: Path) -> None:
    out_dir.mkdir(parents=True, exist_ok=True)
    for locale, entry in config["locales"].items():
        for voice in entry["candidates"]:
            audio, words = await synthesize_sentences(entry["text"], voice, "+0%")
            (out_dir / f"{locale}-{voice}.mp3").write_bytes(audio)
            gaps = [round(b.start - a.end, 2) for a, b in zip(words, words[1:])]
            print(
                f"{locale} {voice}: {duration_of(audio):.2f} s, {len(words)} mots, "
                f"premier mot {words[0].start:.2f} s, dernier {words[-1].end:.2f} s, pauses > 0,15 s : {[g for g in gaps if g > 0.15]}"
            )


def main() -> None:
    config = json.loads(CONFIG.read_text(encoding="utf-8"))
    if len(sys.argv) >= 3 and sys.argv[1] == "--candidates":
        asyncio.run(compare_candidates(config, Path(sys.argv[2])))
    else:
        asyncio.run(generate_site(config))


if __name__ == "__main__":
    main()
