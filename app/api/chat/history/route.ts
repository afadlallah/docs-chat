import { currentUser } from '@clerk/nextjs/server'
import { getChatsByUser } from '@/lib/db'

export async function GET() {
  const user = await currentUser()

  if (!user || !user.emailAddresses[0].emailAddress) {
    return Response.json('Unauthorized!', { status: 401 })
  }

  const chats = await getChatsByUser({ email: user.emailAddresses[0].emailAddress })
  return Response.json(chats)
}
