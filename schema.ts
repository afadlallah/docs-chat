import { Message } from 'ai'
import { InferSelectModel } from 'drizzle-orm'
import { json, pgTable, real, text, timestamp, varchar } from 'drizzle-orm/pg-core'

export const chat = pgTable('Chat', {
  id: text('id').primaryKey().notNull(),
  createdAt: timestamp('createdAt').notNull(),
  messages: json('messages').notNull(),
  author: varchar('author', { length: 64 }).notNull()
})

export const chunk = pgTable('Chunk', {
  id: text('id').primaryKey().notNull(),
  filePath: text('filePath').notNull(),
  content: text('content').notNull(),
  embedding: real('embedding').array().notNull()
})

export type Chat = Omit<InferSelectModel<typeof chat>, 'messages'> & {
  messages: Array<Message>
}

export type Chunk = InferSelectModel<typeof chunk>