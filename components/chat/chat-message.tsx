import { ChatMessageProps } from '@/types'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Markdown } from '@/components/markdown'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card } from '@/components/ui/card'

export function ChatMessage({ message, userImage }: ChatMessageProps) {
  const isAI = message.role === 'assistant'

  return (
    <motion.div
      animate={{ y: 0, opacity: 1 }}
      className={cn('flex w-full flex-row gap-4 px-4 first-of-type:pt-10 md:px-0', isAI ? 'justify-start' : 'justify-end')}
      initial={{ y: 5, opacity: 0 }}
    >
      <div className={cn('flex items-start gap-4', isAI ? 'flex-row' : 'flex-row-reverse')}>
        <Avatar>
          <AvatarImage src={isAI ? undefined : userImage || ''} />
          <AvatarFallback>{isAI ? 'AI' : 'You'}</AvatarFallback>
        </Avatar>
        <Card className={cn('max-w-[80%] p-4', isAI ? 'bg-muted' : 'bg-primary text-primary-foreground')}>
          <Markdown>{message.content}</Markdown>
        </Card>
      </div>
    </motion.div>
  )
}
