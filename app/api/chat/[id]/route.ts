import { currentUser } from '@clerk/nextjs/server'
import { deleteChat } from '@/lib/db'

export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params
  try {
    const user = await currentUser()

    if (!user?.emailAddresses[0]?.emailAddress) {
      return new Response('Unauthorized', { status: 401 })
    }

    await deleteChat({ id: params.id })
    return new Response(null, { status: 204 })
  } catch (error) {
    console.error('Error deleting chat:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}
