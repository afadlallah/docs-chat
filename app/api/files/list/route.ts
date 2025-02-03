import { currentUser } from '@clerk/nextjs/server'
import { list } from '@vercel/blob'

export async function GET() {
  const user = await currentUser()

  if (!user) {
    return Response.redirect('/login')
  }

  if (!user || !user.emailAddresses[0].emailAddress) {
    return Response.redirect('/login')
  }

  const { blobs } = await list({ prefix: user.emailAddresses[0].emailAddress })

  return Response.json(
    blobs.map((blob) => ({
      ...blob,
      pathname: blob.pathname.replace(`${user.emailAddresses[0].emailAddress}/`, '')
    }))
  )
}
