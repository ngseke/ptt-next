import { Nullish } from '@/types/Nullish'
import axios from 'axios'

import { JSDOM } from 'jsdom'

export async function fetchPost({
  board,
  id,
}: {
  board: string
  id: Nullish<string>
}) {
  if (!id) return null
  const { data } = await axios.get(`https://www.ptt.cc/bbs/${board}/${id}.html`)

  const { document } = new JSDOM(data).window

  const $metaLines = document.querySelectorAll('.article-metaline')

  const { title, author, date } = (() => {
    let title = null
    let author = null
    let date = null

    for (const $line of $metaLines) {
      const $key = $line.querySelector('.article-meta-tag')
      const $value = $line.querySelector('.article-meta-value')
      if (!$key || !$value) continue

      const key = $key.textContent?.trim()
      const value = $value.textContent?.trim() ?? null

      if (key === '標題') title = value
      if (key === '作者') author = value
      if (key === '時間') date = value
    }

    return { title, author, date }
  })()

  const content = (() => {
    const $content = document
      .querySelector('#main-content')
      ?.cloneNode(true) as HTMLElement

    ;[
      ...$content?.querySelectorAll(
        '.article-metaline, .article-metaline-right'
      ),
    ].forEach(($el) => $el.remove())

    return $content.innerHTML.trim()
  })()

  return {
    title,
    author,
    date,
    content,
  }
}
