import { openai } from '@ai-sdk/openai'
import { currentUser } from '@clerk/nextjs/server'
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters'
import { put } from '@vercel/blob'
import { embedMany } from 'ai'
import { insertChunks } from '@/lib/db'
import { getPdfContent } from '@/lib/pdf'

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url)
  const filename = searchParams.get('filename')

  const user = await currentUser()

  if (!user) {
    return Response.redirect('/login')
  }

  if (!user || !user.emailAddresses[0].emailAddress) {
    return Response.redirect('/login')
  }

  if (request.body === null) {
    return new Response('Request body is empty', { status: 400 })
  }

  const uniqueFilename = `${Date.now()}-${Math.random().toString(36).substring(2)}-${filename}`

  const { pathname, url: downloadUrl } = await put(`${user.emailAddresses[0].emailAddress}/${uniqueFilename}`, request.body, {
    access: 'public'
  })

  const content = await getPdfContent(downloadUrl)
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000
  })
  const chunkedContent = await textSplitter.createDocuments([content])

  const { embeddings } = await embedMany({
    model: openai.embedding('text-embedding-3-small'),
    values: chunkedContent.map((chunk) => chunk.pageContent)
  })

  await insertChunks({
    chunks: chunkedContent.map((chunk, i) => ({
      id: `${pathname}/${i}`,
      filePath: pathname,
      content: chunk.pageContent,
      embedding: embeddings[i]
    }))
  })

  return Response.json({ pathname })
}
