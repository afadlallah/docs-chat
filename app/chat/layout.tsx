import { Menu } from 'lucide-react'
import { ChatSidebar } from '@/components/chat/chat-sidebar'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from '@/components/ui/sheet'

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='relative flex h-[calc(100vh-4.1rem)] overflow-hidden'>
      <Sheet>
        <SheetTrigger asChild>
          <Button className='absolute left-2 top-2 z-40 lg:hidden' size='icon' variant='ghost'>
            <Menu className='size-4' />
          </Button>
        </SheetTrigger>
        <SheetContent className='w-64 p-0' side='left'>
          <SheetTitle className='sr-only'>Chat Navigation</SheetTitle>
          <SheetDescription className='sr-only'>Navigation sidebar for chat conversations</SheetDescription>
          <ChatSidebar />
        </SheetContent>
      </Sheet>

      <div className='hidden w-64 flex-none border-r bg-muted/40 lg:block'>
        <ChatSidebar />
      </div>

      <div className='flex-1 overflow-hidden'>{children}</div>
    </div>
  )
}
