import { redirect } from 'next/navigation'

export default async function Page({
  params,
}: {
  params: Promise<{ board: string }>
}) {
  const { board } = await params
  redirect(`/bbs/${board}/index/`)
}
