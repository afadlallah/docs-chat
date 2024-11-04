'use client'

import { useRef, useState } from 'react'
import { FileInfo, SelectedFilesStore } from '@/types'
import { FileText, Loader2, Trash, Upload } from 'lucide-react'
import { toast } from 'sonner'
import useSWR from 'swr'
import { create } from 'zustand'
import { cn, fetcher } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'

export const useSelectedFiles = create<SelectedFilesStore>((set) => ({
  selectedFiles: [],
  setSelectedFiles: (files) =>
    set((state) => ({
      selectedFiles: typeof files === 'function' ? files(state.selectedFiles) : files
    }))
}))

export function ChatFiles() {
  const [isOpen, setIsOpen] = useState(false)
  const { selectedFiles, setSelectedFiles } = useSelectedFiles()
  const [uploadQueue, setUploadQueue] = useState<string[]>([])
  const [deleteQueue, setDeleteQueue] = useState<string[]>([])
  const inputFileRef = useRef<HTMLInputElement>(null)

  const { data: files, mutate } = useSWR<FileInfo[]>('/api/files/list', fetcher, {
    fallbackData: []
  })

  async function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files
    if (!files?.length) return

    for (const file of Array.from(files)) {
      try {
        setUploadQueue((queue) => [...queue, file.name])

        const response = await fetch(`/api/files/upload?filename=${encodeURIComponent(file.name)}`, {
          method: 'POST',
          body: file
        })

        if (!response.ok) throw new Error('Upload failed')

        await mutate()
        toast.success(`Uploaded ${file.name}`)
      } catch (error) {
        toast.error(`Failed to upload ${file.name}`)
      } finally {
        setUploadQueue((queue) => queue.filter((name) => name !== file.name))
      }
    }
  }

  async function handleFileDelete(file: FileInfo) {
    const originalFilename =
      file.pathname
        .split('/')
        .pop()
        ?.replace(/^\d+-\w+-/, '') || file.pathname

    try {
      setDeleteQueue((queue) => [...queue, file.pathname])
      const response = await fetch(`/api/files/delete?fileurl=${encodeURIComponent(file.url)}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Delete failed')

      setSelectedFiles((current) => current.filter((path) => path !== file.pathname))
      await mutate()
      toast.success(`Deleted ${originalFilename}`)
    } catch (error) {
      toast.error(`Failed to delete ${originalFilename}`)
    } finally {
      setDeleteQueue((queue) => queue.filter((name) => name !== file.pathname))
    }
  }

  const toggleFileSelection = (pathname: string) => {
    if (deleteQueue.includes(pathname)) return

    setSelectedFiles(selectedFiles.includes(pathname) ? selectedFiles.filter((path) => path !== pathname) : [...selectedFiles, pathname])
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className='relative flex items-center'>
          <Button size='icon' variant='accent'>
            <FileText className='size-4' />
          </Button>
          {selectedFiles.length > 0 && (
            <Badge className='absolute -right-2 -top-2 size-5 justify-center rounded-full p-0' variant='default'>
              {selectedFiles.length}
            </Badge>
          )}
        </div>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[625px]'>
        <DialogHeader>
          <DialogTitle>Manage PDF Files</DialogTitle>
          <DialogDescription>Select files to include in the chat context or upload new ones.</DialogDescription>
        </DialogHeader>

        <div className='my-4 flex items-center justify-between'>
          <p className='text-sm text-muted-foreground'>
            {selectedFiles.length} of {files?.length} selected
          </p>
          <input ref={inputFileRef} multiple accept='.pdf' className='hidden' type='file' onChange={handleFileUpload} />
          <Button onClick={() => inputFileRef.current?.click()}>
            <Upload className='mr-2 size-4' />
            Upload PDF
          </Button>
        </div>

        <Card className='relative min-h-[300px]'>
          <ScrollArea className='h-[300px] p-4'>
            {files?.length === 0 && uploadQueue.length === 0 ? (
              <div className='flex h-full items-center justify-center text-muted-foreground'>No files uploaded yet</div>
            ) : (
              <div className='space-y-4'>
                {uploadQueue.map((fileName, index) => (
                  <div
                    key={`uploading-${fileName}-${index}`}
                    className='flex cursor-not-allowed items-center justify-between rounded-md border p-2'
                  >
                    <div className='flex items-center gap-2'>
                      <Checkbox disabled checked={false} />
                      <span className='text-sm text-muted-foreground'>{fileName}</span>
                    </div>
                    <div className='flex size-8 items-center justify-center'>
                      <Loader2 className='size-4 animate-spin' />
                    </div>
                  </div>
                ))}

                {files
                  ?.sort((a, b) => {
                    const nameA =
                      a.pathname
                        .split('/')
                        .pop()
                        ?.replace(/^\d+-\w+-/, '') || a.pathname
                    const nameB =
                      b.pathname
                        .split('/')
                        .pop()
                        ?.replace(/^\d+-\w+-/, '') || b.pathname
                    return nameA.localeCompare(nameB)
                  })
                  .map((file) => (
                    <div
                      key={file.pathname}
                      className={cn(
                        'flex items-center justify-between rounded-md border p-2',
                        selectedFiles.includes(file.pathname) && 'bg-muted',
                        (deleteQueue.includes(file.pathname) || uploadQueue.includes(file.pathname)) && 'cursor-not-allowed',
                        !deleteQueue.includes(file.pathname) && !uploadQueue.includes(file.pathname) && 'cursor-pointer'
                      )}
                      onClick={() => toggleFileSelection(file.pathname)}
                    >
                      <div className='flex flex-1 items-center gap-2'>
                        <Checkbox
                          checked={selectedFiles.includes(file.pathname)}
                          disabled={deleteQueue.includes(file.pathname) || uploadQueue.includes(file.pathname)}
                          onCheckedChange={() => toggleFileSelection(file.pathname)}
                        />
                        <span className={cn('text-sm', deleteQueue.includes(file.pathname) && 'text-muted-foreground')}>
                          {file.pathname
                            .split('/')
                            .pop()
                            ?.replace(/^\d+-\w+-/, '') || file.pathname}
                        </span>
                      </div>
                      <div className='flex size-8 items-center justify-center'>
                        {deleteQueue.includes(file.pathname) ? (
                          <Loader2 className='size-4 animate-spin' />
                        ) : (
                          <Button
                            className='size-8 hover:text-destructive'
                            size='icon'
                            variant='ghost'
                            onClick={(e) => {
                              e.stopPropagation()
                              handleFileDelete(file)
                            }}
                          >
                            <Trash className='size-4' />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </ScrollArea>
        </Card>
      </DialogContent>
    </Dialog>
  )
}
