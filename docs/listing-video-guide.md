# Preparing a listing walkthrough video

Videos on a property listing must be **MP4, H.264, under 25 MB**. Almost
every clip needs shrinking first, including an MP4 straight from an
Android phone. This is the only manual step — the upload panel does
everything else.

**Why an MP4 from the phone is usually still too big.** Phones record at
around 17 Mbps, because they are optimised for editing later rather than
for sending to a buyer. At that rate 25 MB buys about **12 seconds** of
footage:

| Source | Bitrate | Fits in 25 MB |
| --- | --- | --- |
| Android / iPhone 1080p, typical | 17 Mbps | 12 seconds |
| Phone 720p | 12 Mbps | 17 seconds |
| After the step below | 2.6 Mbps | 77 seconds |

So a file that is already under 25 MB is almost certainly too short to be
a useful walkthrough. Compressing removes waste the phone had no reason
to avoid — it is not the same as lowering quality.

> **Do not set a maximum file size in the camera app.** Some Android
> camera apps offer this. It stops the recording when the limit is
> reached rather than compressing anything, so you get a walkthrough that
> cuts off mid-room. It would upload cleanly and be useless.

The upload will refuse a file that is too big or in the wrong format, so
nothing broken can reach a buyer. But it is quicker to get it right than
to be turned away.

---

## Before you film: set the phone to H.264

Do this once on every phone used for site visits. It removes the most
common problem entirely.

- **iPhone** — Settings → Camera → Formats → **Most Compatible**
- **Android** — Camera app → Settings → look for *Video codec* and choose
  **H.264** (not HEVC or H.265)

Phones default to HEVC, which produces smaller files but **will not play
on many Android phones** — including for the buyers we are sending the
listing to. The change costs nothing; the files are slightly larger,
which the step below deals with anyway.

On Android the HEVC usually sits **inside an `.mp4`**, so the file looks
correct and is still refused at upload. The codec matters, not the file
extension.

**Keep clips to 45–60 seconds.** Two short, well-shot clips beat one long
one, and the size limit is per clip.

**What not to film:** neighbours, people's faces, the doors of adjacent
houses, and vehicle number plates. That is personal data, and we publish
these videos on a public page.

---

## Converting and shrinking with HandBrake

HandBrake is free, and it is a normal window you drag a file into.
Download it from **[handbrake.fr](https://handbrake.fr)** (choose the
Windows version).

**It handles `.mov` files, including HEVC ones.** This is the tool that
fixes footage already shot on the old setting — drag the `.mov` in and an
`.mp4` comes out, converted and shrunk in the same pass. You do not need
anything else, and you do not need to re-shoot.

Worth knowing why the website cannot do this for you: browsers cannot
decode HEVC, which is why the upload panel turns those files away.
HandBrake carries its own decoders, so it reads what the browser cannot.

### Set it up once

1. Open HandBrake and drag in any video.
2. On the right, under **Summary**:
   - **Format**: MP4
   - Tick **Web Optimized** — important, this is what lets a buyer start
     watching before the whole file has downloaded
3. **Dimensions** tab: set **Resolution Limit** to **1080p HD**. Leave
   everything else alone — HandBrake keeps portrait videos upright by
   itself.
4. **Video** tab:
   - **Video Encoder**: H.264 (x264)
   - **Framerate**: Same as source, and choose **Peak Framerate**
   - Select **Avg Bitrate (kbps)** and enter **2500**
   - Tick **2-Pass Encoding**
5. **Audio** tab: **AAC**, Bitrate **96**
6. Top menu: **Preset → Save As…** and name it **PropITZ Listing Video**

That is the setup done. It only needs doing once per computer.

### Every time after that

1. Drag the video into HandBrake — `.mov` or `.mp4`, either is fine
2. Choose the **PropITZ Listing Video** preset from the preset list
3. Pick where to save it under **Save As**
4. Click **Start Encode**

A 60-second clip takes a minute or two and comes out around **19 MB** —
comfortably under the limit. Check it plays, then upload it.

### If it still comes out over 25 MB

The clip is probably longer than a minute. Either trim it, or lower
**Avg Bitrate** to 1800 and encode again.

---

## Footnote: the same thing with ffmpeg

For anyone who prefers a terminal. Install once with
`winget install Gyan.FFmpeg`, then:

```bash
ffmpeg -i INPUT.mov -c:v libx264 -b:v 2500k -maxrate 3000k -bufsize 5000k -vf "scale=w=1920:h=1080:force_original_aspect_ratio=decrease:force_divisible_by=2" -profile:v high -r 30 -c:a aac -b:a 96k -movflags +faststart OUTPUT.mp4
```

What the important parts do:

| | |
|---|---|
| `-c:v libx264` | H.264, so every phone can play it |
| `-b:v 2500k` | about 19 MB a minute |
| `scale=…decrease` | caps at 1080p without stretching or upscaling; portrait stays portrait |
| `-movflags +faststart` | lets playback begin before the file finishes downloading |

To do a whole folder at once, in PowerShell:

```powershell
Get-ChildItem *.mov, *.mp4 | ForEach-Object { ffmpeg -i $_.FullName -c:v libx264 -b:v 2500k -maxrate 3000k -bufsize 5000k -vf "scale=w=1920:h=1080:force_original_aspect_ratio=decrease:force_divisible_by=2" -profile:v high -r 30 -c:a aac -b:a 96k -movflags +faststart "$($_.BaseName)-web.mp4" }
```

---

## Uploading

Account → Property Listings → open the listing → **Walkthrough videos**.
Up to two clips, 25 MB each.

If a file is refused, the message says why:

- **"is not an MP4"** — it is still a `.mov`. Run it through the step above.
- **"could not be decoded"** — it is HEVC. Re-encode it as H.264; fix the
  phone setting so it stops happening.
- **"is NN MB"** — too large. Shrink it further.
