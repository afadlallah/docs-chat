import { openai } from '@ai-sdk/openai'
import { currentUser } from '@clerk/nextjs/server'
import { cosineSimilarity, embed, Experimental_LanguageModelV1Middleware, generateObject, generateText } from 'ai'
import { z } from 'zod'
import { getChunksByFilePaths } from '@/lib/db'

const selectionSchema = z.object({
  files: z.object({
    selection: z.array(z.string())
  })
})

export const ragMiddleware: Experimental_LanguageModelV1Middleware = {
  transformParams: async ({ params }) => {
    const user = await currentUser()

    if (!user) return params

    const { prompt: messages, providerMetadata } = params

    const { data, success } = selectionSchema.safeParse(providerMetadata)

    if (!success || !data.files.selection.length) return params

    const selection = data.files.selection

    const recentMessage = messages.pop()

    if (!recentMessage || recentMessage.role !== 'user') {
      if (recentMessage) {
        messages.push(recentMessage)
      }
      return params
    }

    const lastUserMessageContent = recentMessage.content
      .filter((content) => content.type === 'text')
      .map((content) => content.text)
      .join('\n')

    // Find relevant chunks based on the selection
    const chunksBySelection = await getChunksByFilePaths({
      filePaths: selection.map((path) => `${user?.emailAddresses[0].emailAddress}/${path}`)
    })

    if (!chunksBySelection.length) {
      messages.push(recentMessage)
      return params
    }

    // Embed the user's question
    const { embedding: questionEmbedding } = await embed({
      model: openai.embedding('text-embedding-3-small'),
      value: lastUserMessageContent
    })

    const chunksWithSimilarity = chunksBySelection.map((chunk) => ({
      ...chunk,
      similarity: cosineSimilarity(questionEmbedding, chunk.embedding)
    }))

    // Rank the chunks by similarity and take the top K
    chunksWithSimilarity.sort((a, b) => b.similarity - a.similarity)
    const k = 10
    const topKChunks = chunksWithSimilarity.slice(0, k)

    // Add the chunks to the last user message
    messages.push({
      role: 'user',
      content: [
        ...recentMessage.content,
        {
          type: 'text',
          text: `Here is some relevant information from the selected documents:`
        },
        ...topKChunks.map((chunk) => ({
          type: 'text' as const,
          text: chunk.content
        }))
      ]
    })

    return { ...params, prompt: messages }
  }
}
