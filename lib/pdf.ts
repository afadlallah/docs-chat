import pdf from 'pdf-parse'

export async function getPdfContent(url: string): Promise<string> {
  const response = await fetch(url)
  const arrayBuffer = await response.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  const data = await pdf(buffer)
  return data.text
}
