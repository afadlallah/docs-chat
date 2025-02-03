'use client'

import Image from 'next/image'
import Link from 'next/link'
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import { useTheme } from 'next-themes'
import { ModeToggle } from '@/components/mode-toggle'
import { Button } from '@/components/ui/button'

export function Header() {
  const { systemTheme, theme } = useTheme()

  const currentTheme = theme === 'system' ? systemTheme : theme

  return (
    <header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='container mx-auto flex h-16 items-center justify-between px-4'>
        <div className='flex items-center space-x-6'>
          <Link className='flex items-center space-x-2' href='/'>
            <Image alt='Docs Chat Logo' className='size-6' height={24} src='/logo.svg' width={24} />
            <span className='hidden font-bold sm:inline-block'>Docs Chat</span>
          </Link>
          <nav className='flex items-center space-x-6 text-sm font-medium'>
            <Link className='text-foreground/60 transition-colors hover:text-foreground/80' href='/chat'>
              Chat
            </Link>
            <Link
              className='text-foreground/60 transition-colors hover:text-foreground/80'
              href='https://github.com/afadlallah/docs-chat'
              rel='noopener noreferrer'
              target='_blank'
            >
              GitHub
            </Link>
          </nav>
        </div>
        <div className='flex items-center space-x-2'>
          <ModeToggle />
          <SignedOut>
            <Link href='/sign-in'>
              <Button className='ml-2' variant='ghost'>
                Sign In
              </Button>
            </Link>
            <Link href='/sign-up'>
              <Button className='ml-2'>Get Started</Button>
            </Link>
          </SignedOut>
          <SignedIn>
            <UserButton
              appearance={{
                baseTheme: currentTheme === 'dark' ? dark : undefined
              }}
            />
          </SignedIn>
        </div>
      </div>
    </header>
  )
}
