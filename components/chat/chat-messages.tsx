'use client'

import { ChatMessagesProps } from '@/types'
import { useScrollToBottom } from '@/hooks/use-scroll-to-bottom'
import { ChatMessage } from '@/components/chat/chat-message'
import { ScrollArea } from '@/components/ui/scroll-area'

export function ChatMessages({ isLoading, messages, userImage }: ChatMessagesProps) {
  const [containerRef, endRef] = useScrollToBottom<HTMLDivElement>(isLoading)

  return (
    <ScrollArea className='flex-1 pr-4'>
      <div ref={containerRef} className='space-y-4'>
        {messages.map((message, index) => (
          <ChatMessage key={message.id || `${message.role}-${index}`} message={message} userImage={userImage} />
        ))}
        <div ref={endRef} />
      </div>
    </ScrollArea>
  )
}
