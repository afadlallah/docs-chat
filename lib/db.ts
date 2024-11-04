import { chat, chunk } from '@/schema'
import { desc, eq, inArray } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

let client = postgres(`${process.env.POSTGRES_URL!}?sslmode=require`)
let db = drizzle(client)

export async function createMessage({ author, id, messages }: { id: string; messages: any; author: string }) {
  const selectedChats = await db.select().from(chat).where(eq(chat.id, id))

  if (selectedChats.length > 0) {
    return await db
      .update(chat)
      .set({
        messages: JSON.stringify(messages)
      })
      .where(eq(chat.id, id))
  }

  return await db.insert(chat).values({
    id,
    createdAt: new Date(),
    messages: JSON.stringify(messages),
    author
  })
}

export async function deleteChat({ id }: { id: string }) {
  return await db.delete(chat).where(eq(chat.id, id))
}

export async function deleteChunksByFilePath({ filePath }: { filePath: string }) {
  return await db.delete(chunk).where(eq(chunk.filePath, filePath))
}

export async function getChatById({ id }: { id: string }) {
  const [selectedChat] = await db.select().from(chat).where(eq(chat.id, id))
  return selectedChat
}

export async function getChatsByUser({ email }: { email: string }) {
  return await db.select().from(chat).where(eq(chat.author, email)).orderBy(desc(chat.createdAt))
}

export async function getChunksByFilePaths({ filePaths }: { filePaths: Array<string> }) {
  return await db.select().from(chunk).where(inArray(chunk.filePath, filePaths))
}

export async function insertChunks({ chunks }: { chunks: any[] }) {
  return await db.insert(chunk).values(chunks)
}
