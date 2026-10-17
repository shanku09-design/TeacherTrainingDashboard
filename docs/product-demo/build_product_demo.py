"""Build the narrated English and Hindi product-demo videos in this folder.

Requires Pillow, edge-tts, and imageio-ffmpeg. The script sends only the
demo narration from narration.json to Microsoft's public speech endpoint.
"""
import asyncio
import json
import re
import subprocess
from pathlib import Path

import edge_tts
import imageio_ffmpeg
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent
WIDTH, HEIGHT = 1920, 1080
NAVY = "#10253F"
INK = "#142B45"
MUTED = "#62748A"
PAPER = "#F5F7F4"
TEAL = "#20A994"
LIME = "#D5EE76"
WHITE = "#FFFFFF"
FONT_DIR = Path("C:/Windows/Fonts")
FONT_REG = FONT_DIR / "segoeui.ttf"
FONT_BOLD = FONT_DIR / "segoeuib.ttf"
FONT_HINDI = FONT_DIR / "Nirmala.ttf"
FONT_HINDI_BOLD = FONT_DIR / "NirmalaB.ttf"


def font(size, bold=False, hindi=False):
    p = (FONT_HINDI_BOLD if bold else FONT_HINDI) if hindi else (FONT_BOLD if bold else FONT_REG)
    if not p.exists():
        p = FONT_BOLD if bold else FONT_REG
    return ImageFont.truetype(str(p), size)


def wrap(draw, text, f, max_width):
    words, lines, line = text.split(), [], ""
    for word in words:
        trial = (line + " " + word).strip()
        if draw.textbbox((0, 0), trial, font=f)[2] <= max_width or not line:
            line = trial
        else:
            lines.append(line)
            line = word
    if line:
        lines.append(line)
    return lines


def rounded(draw, box, radius, fill, outline=None, width=1):
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def render_card(lang, index, scene):
    is_hi = lang == "hindi"
    img = Image.new("RGB", (WIDTH, HEIGHT), PAPER)
    d = ImageDraw.Draw(img)
    # Decorative brand shapes and persistent presentation frame.
    d.rectangle((0, 0, WIDTH, 16), fill=TEAL)
    d.ellipse((1580, -280, 2160, 300), fill="#E5F2EC")
    d.ellipse((-250, 820, 200, 1270), fill="#EAF1D8")
    d.text((112, 75), "TEACHER TRAINING TRACKER", font=font(27, True), fill=INK)
    d.text((1808, 79), "PRODUCT WALKTHROUGH  ·  " + ("हिन्दी" if is_hi else "ENGLISH"), font=font(22, True, is_hi), fill=MUTED, anchor="ra")
    d.line((112, 132, 1808, 132), fill="#DDE5E3", width=2)
    # Left text panel.
    d.text((120, 193), f"0{index + 1}   /   06", font=font(22, True), fill=TEAL)
    heading = scene["heading"]
    hf = font(59 if not is_hi else 57, True, is_hi)
    y = 246
    for line in wrap(d, heading, hf, 785):
        d.text((120, y), line, font=hf, fill=INK)
        y += 82
    # Intro copy, keeping narration's core ideas visible.
    body_f = font(29 if not is_hi else 28, False, is_hi)
    y += 33
    lines = wrap(d, scene["body"], body_f, 745)
    for line in lines[:8]:
        d.text((122, y), line, font=body_f, fill=MUTED)
        y += 48
    # App-inspired interface illustration, not a fake live screen capture.
    rounded(d, (1000, 200, 1798, 875), 28, WHITE, "#E1E8E5", 2)
    rounded(d, (1000, 200, 1230, 875), 28, NAVY)
    d.rectangle((1200, 200, 1230, 875), fill=NAVY)
    d.ellipse((1040, 241, 1088, 289), fill=TEAL)
    d.text((1100, 244), "TT", font=font(26, True), fill=WHITE)
    d.text((1039, 329), "WORKSPACE", font=font(15, True), fill="#9FB3C4")
    nav_items = ["Overview", "Programmes", "Training plans", "Batches", "Reports"]
    active = [0, 1, 4, 2, 0, 4][index]
    for n, label in enumerate(nav_items):
        yy = 367 + n * 62
        if n == active:
            rounded(d, (1022, yy - 10, 1210, yy + 39), 12, "#24435A")
        d.ellipse((1040, yy + 3, 1054, yy + 17), fill=TEAL if n == active else "#8298A9")
        d.text((1070, yy - 3), label, font=font(19, n == active), fill=WHITE if n == active else "#C3CFD7")
    title = ["Programme overview", "Programme setup", "Progress reports", "Trainer workspace", "My learning", "Progress overview"][index]
    d.text((1270, 245), title, font=font(30, True), fill=INK)
    d.text((1270, 291), "KGBV DIGITAL CLASSROOMS", font=font(15, True), fill=MUTED)
    # Summary cards.
    cards = [(1270, 342, 1518, 472), (1540, 342, 1770, 472)]
    metrics = [("Training plans", "Active"), ("School readiness", "In progress")]
    if index in (1, 2): metrics = [("Programme", "Digital classrooms"), ("Coverage", "Sample view")]
    if index == 3: metrics = [("My assignments", "Upcoming"), ("Session plan", "Ready to review")]
    if index == 4: metrics = [("My training", "In progress"), ("Learning resources", "Available")]
    if index == 5: metrics = [("Participants", "Track progress"), ("Next step", "Explore reports")]
    for box, (label, value) in zip(cards, metrics):
        rounded(d, box, 17, "#F8FAF9", "#E6ECE9", 1)
        d.text((box[0]+18, box[1]+19), label, font=font(18), fill=MUTED)
        d.text((box[0]+18, box[1]+63), value, font=font(20, True), fill=INK)
    # Report / workflow panel.
    rounded(d, (1270, 495, 1770, 824), 18, "#F8FAF9", "#E6ECE9", 1)
    d.text((1300, 518), "Training journey", font=font(21, True), fill=INK)
    stages = [("Programme", TEAL), ("Training plan", "#4D83A5"), ("Session", "#84B78D"), ("Progress", "#D3AD54")]
    for j, (label, color) in enumerate(stages):
        yy = 578 + j * 53
        d.ellipse((1305, yy, 1333, yy+28), fill=color)
        d.text((1354, yy-2), label, font=font(20), fill=INK)
        d.line((1319, yy+28, 1319, yy+49), fill="#C8D4D0", width=3)
    d.text((1300, 791), "Illustrative sample data", font=font(15, True), fill=MUTED)
    # Footer / progress bar.
    d.text((120, 947), "PROGRAMME OVERSIGHT   →   SESSION DELIVERY   →   LEARNER PROGRESS", font=font(18, True), fill=MUTED)
    rounded(d, (120, 1002, 1800, 1011), 5, "#DFE7E2")
    rounded(d, (120, 1002, int(120 + 1680 * (index+1)/6), 1011), 5, TEAL)
    return img


def srt_time(seconds):
    ms = int(round(seconds * 1000))
    h, ms = divmod(ms, 3600000)
    m, ms = divmod(ms, 60000)
    s, ms = divmod(ms, 1000)
    return f"{h:02}:{m:02}:{s:02},{ms:03}"


async def main():
    data = json.loads((ROOT / "narration.json").read_text(encoding="utf-8"))
    ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
    for lang, voice in [("english", "en-IN-NeerjaNeural"), ("hindi", "hi-IN-SwaraNeural")]:
        work = ROOT / f".{lang}_render"
        work.mkdir(exist_ok=True)
        scenes = data[lang]
        clips, subtitle_rows, cursor = [], [], 0.0
        for i, scene in enumerate(scenes):
            audio = work / f"scene_{i+1:02}.mp3"
            print(f"Generating {lang} voice, scene {i+1}/{len(scenes)}...", flush=True)
            await asyncio.wait_for(edge_tts.Communicate(scene["body"], voice, rate="-4%").save(str(audio)), timeout=45)
            img_path = work / f"scene_{i+1:02}.png"
            render_card(lang, i, scene).save(img_path)
            # Derive voice duration through ffmpeg's probe output.
            probe = subprocess.run([ffmpeg, "-i", str(audio), "-f", "null", "-"], capture_output=True, text=True)
            match = re.search(r"Duration: (\d+):(\d+):(\d+(?:\.\d+)?)", probe.stderr)
            duration = int(match.group(1))*3600 + int(match.group(2))*60 + float(match.group(3)) if match else 12.0
            duration += 0.65
            clip = work / f"clip_{i+1:02}.mp4"
            subprocess.run([ffmpeg, "-y", "-loop", "1", "-framerate", "25", "-i", str(img_path), "-i", str(audio), "-t", f"{duration:.3f}", "-vf", "format=yuv420p", "-c:v", "libx264", "-preset", "medium", "-crf", "22", "-c:a", "aac", "-b:a", "160k", "-ar", "48000", "-shortest", str(clip)], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            clips.append(clip)
            subtitle_rows.append((cursor, cursor + duration - .25, scene["body"]))
            cursor += duration
        concat = work / "concat.txt"
        concat.write_text("".join(f"file '{p.as_posix()}'\n" for p in clips), encoding="utf-8")
        output = ROOT / f"teacher-training-tracker-demo-{lang}.mp4"
        subprocess.run([ffmpeg, "-y", "-f", "concat", "-safe", "0", "-i", str(concat), "-c", "copy", "-movflags", "+faststart", str(output)], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        srt = []
        for n, (start, end, text) in enumerate(subtitle_rows, 1):
            srt += [str(n), f"{srt_time(start)} --> {srt_time(end)}", text, ""]
        (ROOT / f"teacher-training-tracker-demo-{lang}.srt").write_text("\n".join(srt), encoding="utf-8-sig")
        print(f"Created {output.name} ({cursor:.0f}s), voice={voice}")


if __name__ == "__main__":
    asyncio.run(main())
