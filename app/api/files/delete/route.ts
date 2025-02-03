import { currentUser } from '@clerk/nextjs/server'
import { del, head } from '@vercel/blob'
import { deleteChunksByFilePath } from '@/lib/db'

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)

  const user = await currentUser()

  if (!user) {
    return Response.redirect('/login')
  }

  if (!user || !user.emailAddresses[0].emailAddress) {
    return Response.redirect('/login')
  }

  if (request.body === null) {
    return new Response('Request body is empty', { status: 400 })
  }

  const fileurl = searchParams.get('fileurl')

  if (fileurl === null) {
    return new Response('File url not provided', { status: 400 })
  }

  const { pathname } = await head(fileurl)

  if (!pathname.startsWith(user.emailAddresses[0].emailAddress)) {
    return new Response('Unauthorized', { status: 400 })
  }

  await del(fileurl)
  await deleteChunksByFilePath({ filePath: pathname })

  return Response.json({})
}
