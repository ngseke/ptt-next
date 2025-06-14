'use client'

import { cn } from '@/modules/cn'
import { fetchBoard } from '@/modules/fetchBoard'
import { IconCornerUpLeft, IconCornerUpRight } from '@tabler/icons-react'
import Link from 'next/link'
import { Badge } from './Badge'
import { MetaList } from './MetaList'
import { Score } from './Score'
import React, { forwardRef } from 'react'
import { Nullish } from '@/types/Nullish'

export const PostList = forwardRef<
  HTMLUListElement,
  {
    board: string
    page: string
    posts: Awaited<ReturnType<typeof fetchBoard>>['posts']
    id: Nullish<string>
  }
>(function PostList({ board, page, posts, id }, ref) {
  return (
    <ul ref={ref} className="flex flex-1 flex-col overflow-auto px-2 py-18">
      {posts?.map((post) => (
        <li key={post.id}>
          <Link
            href={post.isDeleted ? '#' : `/bbs/${board}/${page}/${post.id}`}
            className={cn('flex flex-col gap-0.5 rounded-lg px-4 py-2', {
              'pointer-events-none opacity-30': post.isDeleted,
              'bg-neutral-200': id === post.id,
            })}
          >
            <div className="font-medium">
              {post.isReply && (
                <Badge icon={<IconCornerUpLeft size={12} stroke={3} />}>
                  RE
                </Badge>
              )}
              {post.isForward && (
                <Badge icon={<IconCornerUpRight size={12} stroke={3} />}>
                  FW
                </Badge>
              )}{' '}
              <span>{post.title}</span>
            </div>
            <MetaList
              list={[
                post.category && <span key="category">{post.category}</span>,
                <Score key="score" value={post.score} />,
                post.author && <span key="author">{post.author}</span>,
                <span key="date">{post.date}</span>,
              ]}
            />
          </Link>
        </li>
      ))}
    </ul>
  )
})
