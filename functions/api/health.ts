/**
 * Cloudflare Pages Function — AI health check, read by ft-tools/ai-audit.mjs.
 * One tiny real call through FT_AI (`text` role), cached 60 s. Always HTTP 200.
 */
import { healthResponse } from '../_lib/ft-ai-health.mjs'
import type { FtAiEnv } from '../_lib/ft-ai.mjs'

interface PagesContext {
  request: Request
  env: FtAiEnv
  waitUntil(promise: Promise<unknown>): void
}

export const onRequestGet = (context: PagesContext): Promise<Response> =>
  healthResponse(context.request, context.env, context)
