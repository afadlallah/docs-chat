'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { Chat } from '@/types'
import { AlertCircle, Loader2, MessageSquare, PlusCircle, Trash } from 'lucide-react'
import { toast } from 'sonner'
import useSWR from 'swr'
import { createNewChat } from '@/lib/actions'
import { cn, fetcher } from '@/lib/utils'
import { ChatFiles } from '@/components/chat/chat-files'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

export function ChatSidebar() {
  const params = useParams()
  const router = useRouter()
  const pathname = usePathname()
  const {
    data: chats,
    error,
    isLoading,
    mutate
  } = useSWR<Chat[]>('/api/chat/history', fetcher, {
    fallbackData: []
  })

  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleNewChat = async () => {
    const newChatId = await createNewChat()
    if (newChatId) {
      router.push(`/chat/${newChatId}`)
    }
  }

  const handleDeleteChat = async (e: React.MouseEvent, chatId: string) => {
    e.preventDefault()
    setDeletingId(chatId)
    try {
      const response = await fetch(`/api/chat/${chatId}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Failed to delete chat')

      await mutate()
      toast.success('Chat deleted')

      if (params.id === chatId) {
        router.push('/chat')
      }
    } catch (error) {
      toast.error('Failed to delete chat')
      console.error('Error deleting chat:', error)
    } finally {
      setDeletingId(null)
    }
  }

  useEffect(() => {
    mutate()
  }, [pathname, mutate])

  function getChatTitle(chat: Chat) {
    if (chat.title) return chat.title
    if (chat.messages?.[0]?.content) return chat.messages[0].content.substring(0, 50) + '...'
    return 'New Chat'
  }

  return (
    <div className='flex h-full flex-col'>
      <div className='flex items-center justify-between gap-3 p-4 pt-14 lg:pt-4'>
        <Button className='w-full' onClick={handleNewChat}>
          <PlusCircle className='mr-2 size-4' />
          New Chat
        </Button>
        <ChatFiles />
      </div>
      <ScrollArea className='flex-1 px-2'>
        {error ? (
          <Alert className='mx-auto' variant='destructive'>
            <AlertCircle className='size-4' />
            <AlertDescription>Failed to load chat history. Please try again later.</AlertDescription>
          </Alert>
        ) : isLoading ? (
          <div className='flex items-center justify-center py-8'>
            <Loader2 className='size-6 animate-spin text-muted-foreground' />
          </div>
        ) : chats?.length === 0 ? (
          <div className='flex flex-col items-center justify-center gap-2 py-8 text-center'>
            <MessageSquare className='size-8 text-muted-foreground' />
            <p className='text-sm text-muted-foreground'>No chat history yet.</p>
            <p className='text-xs text-muted-foreground'>Click &apos;New Chat&apos; to get started.</p>
          </div>
        ) : (
          <div>
            {chats?.map((chat) => (
              <Link key={chat.id} href={`/chat/${chat.id}`}>
                <div
                  className={cn(
                    'group relative flex h-9 w-full items-center justify-between gap-2 truncate whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
                    {
                      'bg-muted': params.id === chat.id,
                      'hover:bg-accent hover:text-accent-foreground': true
                    }
                  )}
                >
                  <div className='flex items-center truncate'>
                    <MessageSquare className='mr-2 size-4 shrink-0' />
                    <span className='truncate'>{getChatTitle(chat)}</span>
                  </div>
                  <div className='flex size-8 items-center justify-center'>
                    {deletingId === chat.id ? (
                      <Loader2 className='size-4 animate-spin text-muted-foreground group-hover:text-foreground' />
                    ) : (
                      <Button
                        className='flex items-center justify-center text-muted-foreground hover:text-destructive group-hover:flex sm:hidden'
                        size='icon'
                        variant='ghost'
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteChat(e, chat.id)
                        }}
                      >
                        <Trash className='size-4' />
                      </Button>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  )
}
