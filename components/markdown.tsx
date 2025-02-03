import React from 'react'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import rehypeKatex from 'rehype-katex'
import rehypePrism from 'rehype-prism-plus'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'

const NonMemoizedMarkdown = ({ children }: { children: string }) => {
  const components = {
    code: ({ children, className, inline, node, ...props }: any) => {
      const match = /language-(\w+)/.exec(className || '')
      return !inline && match ? (
        <pre
          {...props}
          className={`${className} mt-2 w-[65dvw] overflow-x-scroll rounded bg-zinc-100 p-2 text-sm dark:bg-zinc-800 md:max-w-[575px] ${
            match[1] ? `language-${match[1]}` : ''
          }`}
        >
          <code className={match[1] ? `language-${match[1]}` : ''}>{children}</code>
        </pre>
      ) : (
        <code className={`${className} rounded bg-zinc-100 px-1 py-0.5 text-sm dark:bg-zinc-800`} {...props}>
          {children}
        </code>
      )
    },
    ol: ({ children, node, ...props }: any) => {
      return (
        <ol className='ml-4 list-outside list-decimal' {...props}>
          {children}
        </ol>
      )
    },
    li: ({ children, node, ...props }: any) => {
      return (
        <li className='py-1' {...props}>
          {children}
        </li>
      )
    },
    ul: ({ children, node, ...props }: any) => {
      return (
        <ul className='ml-4 list-outside list-disc' {...props}>
          {children}
        </ul>
      )
    },
    strong: ({ children, node, ...props }: any) => {
      return (
        <span className='font-semibold' {...props}>
          {children}
        </span>
      )
    },
    a: ({ children, node, ...props }: any) => {
      return (
        <Link className='text-blue-500 hover:underline' rel='noreferrer' target='_blank' {...props}>
          {children}
        </Link>
      )
    },
    h1: ({ children, node, ...props }: any) => (
      <h1 className='mb-4 mt-6 text-2xl font-bold' {...props}>
        {children}
      </h1>
    ),
    h2: ({ children, node, ...props }: any) => (
      <h2 className='mb-3 mt-5 text-xl font-bold' {...props}>
        {children}
      </h2>
    ),
    h3: ({ children, node, ...props }: any) => (
      <h3 className='mb-2 mt-4 text-lg font-bold' {...props}>
        {children}
      </h3>
    ),
    h4: ({ children, node, ...props }: any) => (
      <h4 className='mb-2 mt-3 text-base font-bold' {...props}>
        {children}
      </h4>
    ),
    h5: ({ children, node, ...props }: any) => (
      <h5 className='mb-1 mt-2 text-sm font-bold' {...props}>
        {children}
      </h5>
    ),
    h6: ({ children, node, ...props }: any) => (
      <h6 className='mb-1 mt-2 text-sm font-bold' {...props}>
        {children}
      </h6>
    ),
    blockquote: ({ children, node, ...props }: any) => (
      <blockquote className='my-4 border-l-4 border-zinc-300 pl-4 italic dark:border-zinc-700' {...props}>
        {children}
      </blockquote>
    ),
    table: ({ children, node, ...props }: any) => (
      <div className='my-4 w-full overflow-x-auto'>
        <table className='w-full border-collapse' {...props}>
          {children}
        </table>
      </div>
    ),
    th: ({ children, node, ...props }: any) => (
      <th className='border border-zinc-300 bg-zinc-100 px-4 py-2 dark:border-zinc-700 dark:bg-zinc-800' {...props}>
        {children}
      </th>
    ),
    td: ({ children, node, ...props }: any) => (
      <td className='border border-zinc-300 px-4 py-2 dark:border-zinc-700' {...props}>
        {children}
      </td>
    ),
    sup: ({ children, node, ...props }: any) => (
      <sup className='text-xs' {...props}>
        {children}
      </sup>
    ),
    footnoteReference: ({ children, identifier, ...props }: any) => (
      <sup className='text-xs' id={`ref-${identifier}`}>
        <a className='text-blue-500 hover:underline' href={`#fn-${identifier}`}>
          {identifier}
        </a>
      </sup>
    ),
    footnoteDefinition: ({ children, identifier, ...props }: any) => (
      <div className='mt-8 border-t border-zinc-200 pt-4 text-sm dark:border-zinc-700' id={`fn-${identifier}`}>
        <sup className='mr-2'>{identifier}.</sup>
        {children}
        <a className='ml-2 text-blue-500 hover:underline' href={`#ref-${identifier}`}>
          ↩
        </a>
      </div>
    ),
    cite: ({ children, ...props }: any) => (
      <cite className='not-italic text-zinc-600 dark:text-zinc-400' {...props}>
        {children}
      </cite>
    )
  }

  return (
    <ReactMarkdown components={components} rehypePlugins={[rehypeKatex, rehypePrism]} remarkPlugins={[remarkGfm, remarkMath]}>
      {children}
    </ReactMarkdown>
  )
}

export const Markdown = React.memo(NonMemoizedMarkdown, (prevProps, nextProps) => prevProps.children === nextProps.children)
