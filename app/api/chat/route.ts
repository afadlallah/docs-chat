import { currentUser } from '@clerk/nextjs/server'
import { convertToCoreMessages, streamText } from 'ai'
import { customModel } from '@/lib/ai'
import { createMessage } from '@/lib/db'

export async function POST(request: Request) {
  const { id, messages, selectedFilePathnames } = await request.json()

  const user = await currentUser()

  if (!user || !user.emailAddresses[0].emailAddress) {
    return new Response('Unauthorized', { status: 401 })
  }

  if (!selectedFilePathnames || selectedFilePathnames.length === 0) {
    return new Response('No files selected', { status: 400 })
  }

  const result = await streamText({
    model: customModel,
    system: `You are a helpful AI assistant designed to help with answering questions and document analysis.
      Keep your responses concise and useful. If you are unsure of an answer, say so. DO NOT try to make up an answer.
      If a question is not related to the documents, politely respond that you are tuned to only answer questions about the documents.

      The user has selected specific PDF files to analyze. Only use information from these selected files to answer questions.

      Format your responses using these guidelines:
      1. For code blocks:
         - Use triple backticks with the language name: \`\`\`python, \`\`\`javascript, etc.
         - Never put LaTeX equations inside code blocks
         - Example:
           \`\`\`python
           def hello():
               print("Hello world")
           \`\`\`

      2. For LaTeX equations:
         - Inline equations: Use single $ on each side, like $E = mc^2$
         - Block/display equations: Use double $$ on each side
         - Example:
           $$
           f(x) = \\int_{-\infty}^{\infty} \\hat{f}(\\xi) e^{2\\pi i \\xi x} d\\xi
           $$

      3. For Markdown:
         - Headers: Use # for h1, ## for h2, etc.
         - Lists: Use - or * for unordered lists, 1. for ordered lists
         - Bold: Use **text** for bold
         - Italic: Use *text* for italic
         - Links: Use [text](url)
         - Tables: Use standard markdown table syntax
         - Footnotes: Use [^1] for footnotes

      4. For quotes:
         - Use > at the start of each line
         - Example:
           > This is a quote
           > It can span multiple lines

      Always verify your formatting before completing your response.`,
    messages: convertToCoreMessages(messages),
    experimental_providerMetadata: {
      files: {
        selection: selectedFilePathnames
      }
    },
    onFinish: async ({ text }) => {
      await createMessage({
        id,
        messages: [...messages, { role: 'assistant', content: text }],
        author: user.emailAddresses[0].emailAddress
      })
    }
  })

  return result.toDataStreamResponse({})
}
