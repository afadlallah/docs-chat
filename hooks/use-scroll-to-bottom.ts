import { RefObject, useEffect, useRef } from 'react'

export function useScrollToBottom<T extends HTMLElement>(isLoading?: boolean): [RefObject<T>, RefObject<T>] {
  const containerRef = useRef<T>(null)
  const endRef = useRef<T>(null)

  useEffect(() => {
    const container = containerRef.current
    const end = endRef.current

    if (container && end) {
      const observer = new MutationObserver(() => {
        end.scrollIntoView({
          behavior: isLoading ? 'instant' : 'smooth',
          block: 'end'
        })
      })

      observer.observe(container, {
        childList: true,
        subtree: true
      })

      return () => observer.disconnect()
    }
  }, [isLoading])

  return [containerRef, endRef]
}
