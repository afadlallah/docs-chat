import Link from 'next/link'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Anthropic, Clerk, GitHub, Google, Groq, Next, OpenAI, Vercel } from '@/components/logos'
import { buttonVariants } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function HomePage() {
  return (
    <div className='flex flex-1 flex-col items-center justify-center px-4 py-8 sm:py-12'>
      <div className='w-full max-w-3xl space-y-8 pt-8 text-center sm:pt-0'>
        <h1 className='text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl'>
          Chat with Your <span className='text-primary'>PDF Documents</span> Using AI
        </h1>

        <p className='mx-auto max-w-[700px] text-gray-500 dark:text-gray-400 md:text-xl'>
          Upload multiple PDF files and have intelligent conversations about their content. Powered by advanced AI to help you extract
          insights from your documents.
        </p>

        <div className='flex flex-col justify-center gap-4 sm:flex-row'>
          <Link className={cn(buttonVariants({ size: 'lg' }))} href='/chat'>
            Start Chatting
          </Link>
          <Link
            className={cn(buttonVariants({ variant: 'outline', size: 'lg' }))}
            href='https://github.com/afadlallah/docs-chat'
            rel='noopener noreferrer'
            target='_blank'
          >
            <Star className='mr-1 size-4 fill-yellow-400 text-yellow-400' />
            Star on GitHub
          </Link>
        </div>

        <div className='mt-16 grid grid-cols-1 gap-4 sm:grid-cols-3'>
          <Card className='p-6'>
            <h3 className='mb-2 font-semibold'>Multiple PDFs</h3>
            <p className='text-sm text-gray-500 dark:text-gray-400'>Upload and analyze multiple PDF documents simultaneously</p>
          </Card>
          <Card className='p-6'>
            <h3 className='mb-2 font-semibold'>AI-Powered Chat</h3>
            <p className='text-sm text-gray-500 dark:text-gray-400'>Have natural conversations about your document content</p>
          </Card>
          <Card className='p-6'>
            <h3 className='mb-2 font-semibold'>Smart Context</h3>
            <p className='text-sm text-gray-500 dark:text-gray-400'>AI understands and remembers the context of your documents</p>
          </Card>
        </div>

        <div className='mt-32 space-y-6'>
          <p className='text-base font-medium text-gray-500 dark:text-gray-400'>Made with</p>
          <div className='mx-auto grid max-w-lg grid-cols-4 place-items-center gap-8 sm:grid-cols-8'>
            <Link
              className='group transition-all hover:scale-150 hover:text-primary'
              href='https://clerk.com'
              rel='noopener noreferrer'
              target='_blank'
            >
              <Clerk size={28} />
            </Link>
            <Link
              className='group transition-all hover:scale-150 hover:text-primary'
              href='https://github.com'
              rel='noopener noreferrer'
              target='_blank'
            >
              <GitHub size={28} />
            </Link>
            <Link
              className='group transition-all hover:scale-150 hover:text-primary'
              href='https://nextjs.org'
              rel='noopener noreferrer'
              target='_blank'
            >
              <Next size={28} />
            </Link>
            <Link
              className='group transition-all hover:scale-150 hover:text-primary'
              href='https://vercel.com'
              rel='noopener noreferrer'
              target='_blank'
            >
              <Vercel size={28} />
            </Link>
            <Link
              className='group transition-all hover:scale-150 hover:text-primary'
              href='https://anthropic.com'
              rel='noopener noreferrer'
              target='_blank'
            >
              <Anthropic size={28} />
            </Link>
            <Link
              className='group transition-all hover:scale-150 hover:text-primary'
              href='https://google.com'
              rel='noopener noreferrer'
              target='_blank'
            >
              <Google size={28} />
            </Link>
            <Link
              className='group transition-all hover:scale-150 hover:text-primary'
              href='https://groq.com'
              rel='noopener noreferrer'
              target='_blank'
            >
              <Groq size={28} />
            </Link>
            <Link
              className='group transition-all hover:scale-150 hover:text-primary'
              href='https://openai.com'
              rel='noopener noreferrer'
              target='_blank'
            >
              <OpenAI size={28} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
