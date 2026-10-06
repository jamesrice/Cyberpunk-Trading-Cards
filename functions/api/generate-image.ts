/**
 * Cloudflare Pages Function — cyberpunk portrait generator.
 *
 * Served at /api/generate-image. Takes the uploaded face (base64) plus a fully
 * built prompt and returns a generated image as a data URL. Gemini is reached
 * through the shared ft-ai gateway (FT_AI service binding, `image` role), which
 * picks the image model and retries/falls back — no key or model name lives here.
 *
 * Failures come back as HTTP 200 with an { error } string so the reason survives
 * Cloudflare's error page; the client surfaces it as the card's error state.
 */

import { generateContent, imageOf, type FtAiEnv } from '../_lib/ft-ai.mjs'

type Env = FtAiEnv

interface PagesContext {
  request: Request
  env: Env
}


function json(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

export const onRequestPost = async (context: PagesContext): Promise<Response> => {
  if (!context.env.FT_AI && !context.env.FT_AI_KEY) {
    console.error('FT_AI service binding is not configured for this deployment')
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

  // The gateway retries transient failures and falls back to the next image model.
  let result
  try {
    result = await generateContent(context.env, 'image', {
      contents: [{ parts: [{ inlineData: { mimeType, data: imageBase64 } }, { text: prompt }] }],
    })
  } catch (err) {
    console.error(`Image gateway call failed: ${String(err)}`)
    return json({ error: 'The image engine is unreachable — try again.' })
  }
  if (result.status >= 400) {
    console.error(`ft-ai image ${result.status}: ${JSON.stringify(result.data).slice(0, 400)}`)
    return json({ error: `The image engine failed (HTTP ${result.status}).` })
  }

  const image = imageOf(result.data)
  if (image) return json({ image: `data:${image.mimeType};base64,${image.data}` })

  // No image — usually a content refusal. Surface the model's text if any.
  const parts: { text?: string }[] = result.data?.candidates?.[0]?.content?.parts ?? []
  const textOut = parts.map((p) => p.text ?? '').filter(Boolean).join(' ').trim()
  console.error(`Image model (${result.model}) returned no image. Text: ${textOut.slice(0, 300)}`)
  return json({
    error: textOut
      ? 'The model declined this photo — try a clearer, front-facing portrait.'
      : 'The model did not return an image — try another photo.',
  })
}
