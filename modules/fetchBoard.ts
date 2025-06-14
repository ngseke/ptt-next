import { Nullish } from '@/types/Nullish'
// import axios from 'axios'

import { JSDOM } from 'jsdom'
import { extractTitle } from './extractTitle'
import { nanoid } from 'nanoid'
import puppeteer from 'puppeteer'

export async function fetchBoard({
  board,
  page,
}: {
  board: string
  page?: Nullish<number>
}) {
  const pageName = `index${page == null ? '' : page}`
  // const { data } = await axios.get(
  //   `https://www.ptt.cc/bbs/${board}/${pageName}.html`
  // )

  const browser = await puppeteer.launch({ headless: true })
  const puppeteerPage = await browser.newPage()
  await puppeteerPage.goto(`https://www.ptt.cc/bbs/${board}/${pageName}.html`)
  const data = await puppeteerPage.content()
  await browser.close()

  const { document } = new JSDOM(data).window

  const isPinnedMap = new WeakMap<Element, boolean>()

  const $posts = (() => {
    const dividerClassName = 'r-list-sep'
    const $posts: Element[] = []
    let isAfterDivider = false

    for (const $el of document.querySelectorAll(
      `.r-ent, .${dividerClassName}`
    )) {
      if ($el.classList.contains(dividerClassName)) {
        isAfterDivider = true
        continue
      }

      $posts.push($el)
      isPinnedMap.set($el, isAfterDivider)
    }

    return $posts.toReversed()
  })()

  const posts = $posts.map(($el) => {
    const $title = $el.querySelector('.title')
    const author = $el.querySelector('.author')?.textContent
    const date = $el.querySelector('.date')?.textContent
    const href = $title?.querySelector('a')?.getAttribute('href')
    const id = /\/([^/]+)\.html$/.exec(href ?? '')?.[1]
    const rawTitle = $title?.textContent?.trim()
    const title = extractTitle(rawTitle ?? '')
    const isReply = rawTitle?.startsWith('Re:')
    const isForward = rawTitle?.startsWith('Fw:')
    const category = /\[(.+)\]/.exec(rawTitle ?? '')?.[1] || null
    const rawScore = $el.querySelector('.nrec')?.textContent
    const score = (() => {
      if (rawScore === '爆') return 100
      if (!rawScore) return 0
      if (rawScore.startsWith('X'))
        return -Number(/X(\d+)/.exec(rawScore)?.[1]) * 10
      return parseInt(rawScore)
    })()
    const isPinned = Boolean(isPinnedMap.get($el))
    const isDeleted = !id

    return {
      title,
      rawTitle,
      isReply,
      isForward,
      category,
      id: id || nanoid(),
      author: author === '-' ? null : author?.trim(),
      date,
      rawScore,
      score,
      isPinned,
      isDeleted,
    }
  })

  const pagination = (() => {
    const $previous = document.querySelector(
      '.btn-group-paging .btn:nth-child(2)'
    )
    const $next = document.querySelector('.btn-group-paging .btn:nth-child(3)')

    function extractPage(path: Nullish<string>) {
      if (!path) return null
      const raw = /\/index(\d+).html/.exec(path)?.[1]
      return Number(raw) || null
    }

    const previous = extractPage($previous?.getAttribute('href'))
    const next = extractPage($next?.getAttribute('href'))

    return { previous, next }
  })()

  return { posts, pagination }
}
