'use client'

import { useRef, useState } from 'react'
import { ChatInputProps } from '@/types'
import { Message } from 'ai'
import { useChat } from 'ai/react'
import { SendHorizontal } from 'lucide-react'
import { toast } from 'sonner'
import { useSelectedFiles } from '@/components/chat/chat-files'
import { ChatFiles } from '@/components/chat/chat-files'
import { ChatMessages } from '@/components/chat/chat-messages'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

export function ChatInput({ chatId, initialMessages, userImage }: ChatInputProps) {
  const { selectedFiles } = useSelectedFiles()
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { handleSubmit, input, isLoading, messages, setInput } = useChat({
    id: chatId,
    initialMessages: initialMessages as Array<Message>,
    body: {
      id: chatId,
      selectedFilePathnames: selectedFiles
    },
    onFinish: () => {
      setIsSubmitting(false)
      setTimeout(() => {
        textareaRef.current?.focus()
      }, 100)
    }
  })

  const handleSubmitWithValidation = async (e: React.FormEvent) => {
    if (selectedFiles.length === 0) {
      toast.error('Please select at least one file to analyze')
      return
    }
    setIsSubmitting(true)
    handleSubmit(e)
  }

  return (
    <>
      <div className='flex-1 overflow-y-auto p-4 pt-14 lg:pt-4'>
        <div className='mx-auto max-w-4xl'>
          <ChatMessages chatId={chatId} isLoading={isLoading} messages={messages} userImage={userImage} />
        </div>
      </div>
      <div className='p-4'>
        <div className='mx-auto flex max-w-4xl items-center gap-4'>
          <div className='flex flex-1 items-center gap-4'>
            <Textarea
              ref={textareaRef}
              className='min-h-[80px]'
              disabled={isLoading || isSubmitting}
              placeholder={selectedFiles.length === 0 ? 'Select files to analyze...' : 'Ask a question about your PDFs...'}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSubmitWithValidation(e)
                }
              }}
            />
            <div className='flex gap-2'>
              <Button disabled={isLoading || isSubmitting} size='icon' onClick={handleSubmitWithValidation}>
                <SendHorizontal className='size-4' />
              </Button>
              <ChatFiles />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
