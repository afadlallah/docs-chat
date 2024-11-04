import { anthropic } from '@ai-sdk/anthropic'
import { google } from '@ai-sdk/google'
import { groq } from '@ai-sdk/groq'
import { openai } from '@ai-sdk/openai'
import { experimental_wrapLanguageModel as wrapLanguageModel } from 'ai'
import { ragMiddleware } from '@/lib/ragMiddleware'

const providers = {
  openai,
  anthropic,
  google,
  groq
} as const

const AI_PROVIDER = process.env.NEXT_PUBLIC_AI_PROVIDER as keyof typeof providers
const AI_MODEL = process.env.NEXT_PUBLIC_AI_MODEL as string

if (!AI_PROVIDER || !AI_MODEL) {
  throw new Error('AI_PROVIDER and AI_MODEL must be set in .env.local')
}

if (!(AI_PROVIDER in providers)) {
  throw new Error(`Invalid AI_PROVIDER: ${AI_PROVIDER}. Must be one of: ${Object.keys(providers).join(', ')}`)
}

export const customModel = wrapLanguageModel({
  model: providers[AI_PROVIDER](AI_MODEL),
  middleware: ragMiddleware
})
