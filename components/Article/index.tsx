import parse from 'html-react-parser'
import styles from './article.module.scss'
import { cn } from '@/modules/cn'

export function Article({ content }: { content: string }) {
  return (
    <article className={cn('whitespace-pre-wrap', styles.article)}>
      {parse(content)}
    </article>
  )
}
