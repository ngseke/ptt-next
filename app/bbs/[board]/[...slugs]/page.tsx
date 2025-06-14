import { fetchBoard } from '@/modules/fetchBoard'
import { MetaList } from '@/components/MetaList'
import { Pagination } from '@/components/Pagination'
import { fetchPost } from '@/modules/fetchPost'
import parse from 'html-react-parser'
import { PostList } from '@/components/PostList'

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
    <div className="flex max-h-dvh min-h-dvh gap-4 overflow-auto p-4">
      <div
        className="sticky top-0 flex w-96 flex-col gap-4 overflow-auto rounded-xl bg-neutral-100 shadow-2xl dark:bg-neutral-900"
        key={page}
      >
        <div className="absolute top-0 left-0 w-full backdrop-blur-lg">
          <div className="mx-6 my-4 text-xl font-black">{board}</div>
        </div>

        <PostList board={board} page={page} posts={posts} id={id} />

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
        <div className="relative flex-1">
          <div className="flex w-full flex-col gap-2 rounded-xl bg-neutral-100 px-4 py-3 backdrop-blur-lg dark:bg-neutral-900">
            <h2 className="text-2xl font-bold">{post?.title}</h2>
            <MetaList
              list={[
                <span key="author">{post.author}</span>,
                <span key="date">{post.date}</span>,
              ]}
            />
          </div>

          <div className="p-4 pt-8">
            <article className="whitespace-pre-wrap">
              {parse(post.content)}
            </article>
          </div>
        </div>
      )}
    </div>
  )
}
