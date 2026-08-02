/**
 * Cloudflare Pages Function — cyberpunk portrait generator.
 *
 * Served at /api/generate-image. Takes the uploaded face (base64) plus a fully
 * built prompt and returns a generated image as a data URL. Keeps the Gemini key
 * server-side. Bind GEMINI_API_KEY as an env var / secret on the Pages project.
 *
 * Failures come back as HTTP 200 with an { error } string so the reason survives
 * Cloudflare's error page; the client surfaces it as the card's error state.
 */

interface Env {
  GEMINI_API_KEY?: string
}

interface PagesContext {
  request: Request
  env: Env
}

// The image model (unlike the retired gemini-2.5-flash text model) is current.
const MODEL = 'gemini-2.5-flash-image'
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`

function json(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

export const onRequestPost = async (context: PagesContext): Promise<Response> => {
  const key = context.env.GEMINI_API_KEY
  if (!key) {
    console.error('GEMINI_API_KEY is not bound to this deployment')
    return json({ error: 'The image engine is not configured for this deployment.' })
  }

  let imageBase64 = ''
  let mimeType = 'image/png'
  let prompt = ''
  try {
    const body = (await context.request.json()) as {
      imageBase64?: string
      mimeType?: string
      prompt?: string
    }
    imageBase64 = typeof body.imageBase64 === 'string' ? body.imageBase64 : ''
    mimeType = typeof body.mimeType === 'string' ? body.mimeType : 'image/png'
    prompt = typeof body.prompt === 'string' ? body.prompt : ''
  } catch {
    return json({ error: 'Invalid request body.' })
  }
  if (!imageBase64 || !prompt) return json({ error: 'Missing image or prompt.' })

  const payload = JSON.stringify({
    contents: { parts: [{ inlineData: { mimeType, data: imageBase64 } }, { text: prompt }] },
  })

  // Retry transient upstream failures (500 / INTERNAL / unavailable), matching the
  // original client behaviour.
  for (let attempt = 0; attempt < 3; attempt++) {
    let res: Response
    try {
      res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
        body: payload,
      })
    } catch (err) {
      console.error(`Image fetch failed (attempt ${attempt}): ${String(err)}`)
      if (attempt < 2) {
        await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)))
        continue
      }
      return json({ error: 'The image engine is unreachable — try again.' })
    }

    if (res.ok) {
      const data = (await res.json()) as {
        candidates?: { content?: { parts?: { text?: string; inlineData?: { mimeType: string; data: string } }[] } }[]
      }
      const parts = data.candidates?.[0]?.content?.parts ?? []
      const imgPart = parts.find((p) => p.inlineData)
      if (imgPart?.inlineData) {
        return json({ image: `data:${imgPart.inlineData.mimeType};base64,${imgPart.inlineData.data}` })
      }
      // No image — usually a content refusal. Surface the model's text if any.
      const textOut = parts.map((p) => p.text ?? '').filter(Boolean).join(' ').trim()
      console.error(`Image model returned no image. Text: ${textOut.slice(0, 300)}`)
      return json({
        error: textOut
          ? 'The model declined this photo — try a clearer, front-facing portrait.'
          : 'The model did not return an image — try another photo.',
      })
    }

    const detail = await res.text().catch(() => '')
    console.error(`Gemini image ${res.status} (attempt ${attempt}): ${detail.slice(0, 400)}`)
    if (res.status >= 500 && attempt < 2) {
      await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)))
      continue
    }
    return json({ error: `The image engine failed (HTTP ${res.status}).` })
  }

  return json({ error: 'The image engine failed after several attempts.' })
}
