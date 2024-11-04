import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import 'katex/dist/katex.min.css'
import { ThemeProvider } from 'next-themes'
import { Toaster } from 'sonner'
import { cn } from '@/lib/utils'
import { Header } from '@/components/layout/header'
import '@/styles/globals.css'

const inter = Inter({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-inter'
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono'
})

export const metadata: Metadata = {
  title: 'Docs Chat - Chat with Your PDF Documents',
  description: 'Upload multiple PDF files and have intelligent conversations about their content using AI.',
  icons: {
    icon: [{ url: '/favicon.svg' }],
    apple: [{ url: '/favicon.svg' }]
  }
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html suppressHydrationWarning className={cn('h-full antialiased', inter.variable, jetbrainsMono.variable)} lang='en'>
        <body className='flex h-full flex-col font-sans antialiased'>
          <ThemeProvider disableTransitionOnChange enableSystem attribute='class' defaultTheme='system'>
            <Header />
            <main className='flex flex-1 flex-col'>{children}</main>
            <Toaster position='top-center' />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
