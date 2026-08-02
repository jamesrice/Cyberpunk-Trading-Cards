/**
 * Cloudflare Pages Function — trading-card stat generator.
 *
 * Served at /api/generate-card. Keeps the Gemini key server-side: the browser
 * never sees it. Bind GEMINI_API_KEY as an env var / secret on the Pages project.
 *
 * Returns HTTP 200 with an { error } payload on failure rather than a 5xx, so the
 * reason survives Cloudflare's error page and the client can fall back cleanly.
 */

interface Env {
  GEMINI_API_KEY?: string
}

interface PagesContext {
  request: Request
  env: Env
}

// Alias that tracks the current Flash model. Pinning a version is what broke this
// app originally: gemini-2.5-flash was retired for new API keys and 404'd.
const MODEL = 'gemini-flash-latest'
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`

const CARD_SCHEMA = {
  type: 'OBJECT',
  properties: {
    abilityName: { type: 'STRING' },
    abilityDescription: { type: 'STRING' },
    faction: { type: 'STRING' },
    power: { type: 'INTEGER' },
    defense: { type: 'INTEGER' },
    serialNumber: { type: 'STRING' },
  },
  required: ['abilityName', 'abilityDescription', 'faction', 'power', 'defense', 'serialNumber'],
}

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
    return json({ error: 'The card engine is not configured for this deployment.' })
  }

  let title = ''
  let description = ''
  try {
    const body = (await context.request.json()) as { title?: string; description?: string }
    title = typeof body.title === 'string' ? body.title : ''
    description = typeof body.description === 'string' ? body.description : ''
  } catch {
    return json({ error: 'Invalid request body.' })
  }

  const prompt = `Based on the Cyberpunk Archetype "${title}" (${description}), generate thematic trading card game data.`

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: CARD_SCHEMA,
          // gemini-flash-latest is a thinking model — it spends output tokens on
          // reasoning before the JSON. 4096 covers the reasoning plus these six
          // short fields with room to spare (it's a ceiling, not usage).
          maxOutputTokens: 4096,
        },
      }),
    })
    if (!res.ok) {
      const detail = await res.text().catch(() => '')
      console.error(`Gemini ${res.status}: ${detail.slice(0, 400)}`)
      return json({ error: `The card engine is unavailable (HTTP ${res.status}).` })
    }
    const data = (await res.json()) as {
      candidates?: { content?: { parts?: { text?: string; thought?: boolean }[] } }[]
    }
    const text =
      data.candidates?.[0]?.content?.parts
        ?.filter((p) => !p.thought)
        .map((p) => p.text ?? '')
        .join('') ?? ''
    if (!text.trim()) return json({ error: 'The card engine returned nothing usable.' })
    return json(JSON.parse(text))
  } catch (err) {
    console.error(`Unhandled card generation failure: ${String(err)}`)
    return json({ error: 'The card engine could not generate data just now.' })
  }
}
