import { Message as AiMessage } from 'ai'

export interface ApplicationError extends Error {
  info: string
  status: number
}

export interface Chat {
  id: string
  title: string | null
  createdAt: string
  updatedAt: string
  userId: string
  messages: AiMessage[]
  author: string
}

export interface ChatFilesProps {
  chatId: string
}

export interface ChatInputProps {
  chatId: string
  initialMessages?: Array<AiMessage>
  userImage: string | null
}

export interface ChatMessageProps {
  message: AiMessage
  userImage: string | null
}

export interface ChatMessagesProps {
  chatId: string
  messages: Array<AiMessage>
  isLoading?: boolean
  userImage: string | null
}

export interface ChatPageProps {
  params: Promise<{
    id: string
  }>
}

export interface File {
  id: string
  name: string
  size: number
  createdAt: string
  chatId: string
}

export interface FileInfo {
  pathname: string
  url: string
}

export interface Message extends AiMessage {
  chatId: string
  createdAt: string
}

export interface SelectedFilesStore {
  selectedFiles: string[]
  setSelectedFiles: (files: string[] | ((current: string[]) => string[])) => void
}
