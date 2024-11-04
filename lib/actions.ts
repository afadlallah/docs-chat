export async function createNewChat() {
  try {
    const newChatId = typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : generateUUIDFallback()

    const response = await fetch('/api/chat/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: newChatId
      })
    })

    if (!response.ok) {
      throw new Error('Failed to create chat')
    }

    return newChatId
  } catch (error) {
    console.error('Error creating chat:', error)
    return null
  }
}

function generateUUIDFallback() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}
