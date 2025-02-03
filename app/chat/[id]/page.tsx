import { notFound } from 'next/navigation'
import { Chat } from '@/schema'
import { ChatPageProps } from '@/types'
import { currentUser } from '@clerk/nextjs/server'
import { Message } from 'ai'
import { getChatById } from '@/lib/db'
import { ChatInput } from '@/components/chat/chat-input'

export default async function ChatPage(props: ChatPageProps) {
  const params = await props.params
  const chatFromDb = await getChatById({ id: await params.id })

  if (!chatFromDb) {
    notFound()
  }

  const chat: Chat = {
    ...chatFromDb,
    messages: chatFromDb.messages as Message[]
  }

  const user = await currentUser()

  if (chat.author !== user?.emailAddresses[0].emailAddress) {
    notFound()
  }

  return (
    <div className='flex h-full flex-col'>
      <ChatInput chatId={await params.id} initialMessages={chat.messages} userImage={user?.imageUrl} />
    </div>
  )
}
