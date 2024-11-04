'use client'

import { useRouter } from 'next/navigation'
import { PlusCircle } from 'lucide-react'
import { createNewChat } from '@/lib/actions'
import { Button } from '@/components/ui/button'

export default function ChatPage() {
  const router = useRouter()

  const handleNewChat = async () => {
    const newChatId = await createNewChat()
    if (newChatId) {
      router.push(`/chat/${newChatId}`)
    }
  }

  return (
    <div className='flex h-full flex-col items-center justify-center space-y-4 p-4 pt-14 lg:pt-4'>
      <h2 className='text-center text-2xl font-bold'>Welcome to Docs Chat</h2>
      <p className='text-center text-muted-foreground'>Start a new chat or select an existing conversation</p>
      <Button onClick={handleNewChat}>
        <PlusCircle className='mr-2 size-4' />
        New Chat
      </Button>
    </div>
  )
}
