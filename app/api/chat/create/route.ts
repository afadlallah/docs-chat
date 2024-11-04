import { NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { createMessage } from '@/lib/db'

export async function POST(req: Request) {
  try {
    const user = await currentUser()

    if (!user?.emailAddresses[0]?.emailAddress) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { id } = await req.json()

    await createMessage({
      id,
      messages: [],
      author: user.emailAddresses[0].emailAddress
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error creating chat:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
