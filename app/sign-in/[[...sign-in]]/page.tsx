'use client'

import { SignIn } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import { useTheme } from 'next-themes'

export default function SignInPage() {
  const { systemTheme, theme } = useTheme()

  const currentTheme = theme === 'system' ? systemTheme : theme

  return (
    <div className='flex flex-1 flex-col items-center justify-center'>
      <div className='mx-auto flex items-center justify-center'>
        <SignIn
          appearance={{
            baseTheme: currentTheme === 'dark' ? dark : undefined
          }}
          forceRedirectUrl='/chat'
        />
      </div>
    </div>
  )
}
