import { cn } from '@/modules/cn'
import { fetchBoard } from '@/modules/fetchBoard'
import Link from 'next/link'
import { MetaList } from '@/components/MetaList'
import { Score } from '@/components/Score'
import { Pagination } from '@/components/Pagination'
import { IconCornerUpLeft, IconCornerUpRight } from '@tabler/icons-react'
import { Badge } from '@/components/Badge'
import { fetchPost } from '@/modules/fetchPost'
import parse from 'html-react-parser'

export default async function Page({
  params,
}: {
  params: Promise<{ board: string; slugs: string[] }>
}) {
  const {
    board,
    slugs: [page, id],
  } = await params

  const { posts, pagination } = await fetchBoard({
    board,
    page: page === 'index' ? null : Number(page),
  })

  const post = await fetchPost({ board, id })

  return (
    <div className="flex max-h-dvh gap-4 overflow-auto p-4">
      <div
        className="sticky top-0 flex w-96 flex-col gap-4 overflow-auto rounded-xl bg-neutral-100 dark:bg-neutral-900"
        key={page}
      >
        <div className="absolute top-0 left-0 w-full backdrop-blur-lg">
          <div className="mx-4 my-4 text-xl font-bold">{board}</div>
        </div>

        <ul className="flex flex-1 flex-col gap-4 overflow-auto px-4 py-18">
          {posts.map((post) => (
            <li key={post.id}>
              <Link
                href={post.isDeleted ? '#' : `/bbs/${board}/${page}/${post.id}`}
                className={cn({
                  'pointer-events-none opacity-30': post.isDeleted,
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
                    post.category && (
                      <span key="category">{post.category}</span>
                    ),
                    <Score key="score" value={post.score} />,
                    post.author && <span key="author">{post.author}</span>,
                    <span key="date">{post.date}</span>,
                  ]}
                />
              </Link>
            </li>
          ))}
        </ul>

        <div className="absolute bottom-0 left-0 w-full backdrop-blur-lg">
          <Pagination
            board={board}
            previous={pagination.previous}
            next={pagination.next}
            id={id}
          />
        </div>
      </div>

      {post && (
        <div className="flex-1">
          <div className="flex w-full flex-col gap-2 rounded-xl bg-neutral-100 px-4 py-3 dark:bg-neutral-900">
            <h2 className="text-2xl font-bold">{post?.title}</h2>
            <MetaList
              list={[
                <span key="author">{post.author}</span>,
                <span key="date">{post.date}</span>,
              ]}
            />
          </div>

          <div className="p-4">
            <article className="whitespace-pre-wrap">
              {parse(post.content)}
            </article>
          </div>
        </div>
      )}
    </div>
  )
}
