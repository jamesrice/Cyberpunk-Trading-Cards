/**
 * Cloudflare Pages Function — trading-card stat generator.
 *
 * Served at /api/generate-card. Gemini is reached through the shared ft-ai
 * gateway (FT_AI service binding, `text` role) — no key or model name lives here.
 *
 * Returns HTTP 200 with an { error } payload on failure rather than a 5xx, so the
 * reason survives Cloudflare's error page and the client can fall back cleanly.
 */

import { generateContent, textOf, type FtAiEnv } from '../_lib/ft-ai.mjs'

type Env = FtAiEnv

interface PagesContext {
  request: Request
  env: Env
}

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
  if (!context.env.FT_AI && !context.env.FT_AI_KEY) {
    console.error('FT_AI service binding is not configured for this deployment')
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
    const result = await generateContent(context.env, 'text', {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: CARD_SCHEMA,
        // The text role is a thinking model — it spends output tokens on reasoning
        // before the JSON. 4096 covers the reasoning plus these six short fields
        // with room to spare (it's a ceiling, not usage).
        maxOutputTokens: 4096,
      },
    })
    if (result.status >= 400) {
      console.error(`ft-ai ${result.status}: ${JSON.stringify(result.data).slice(0, 400)}`)
      return json({ error: `The card engine is unavailable (HTTP ${result.status}).` })
    }
    const text = textOf(result.data) ?? ''
    if (!text.trim()) return json({ error: 'The card engine returned nothing usable.' })
    return json(JSON.parse(text))
  } catch (err) {
    console.error(`Unhandled card generation failure: ${String(err)}`)
    return json({ error: 'The card engine could not generate data just now.' })
  }
}
