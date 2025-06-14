import { cn } from '@/modules/cn'
import { Nullish } from '@/types/Nullish'
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
} from '@tabler/icons-react'
import Link from 'next/link'
import { ComponentProps } from 'react'

function IconLink({
  href,
  className,
  disabled,
  ...props
}: ComponentProps<typeof Link> & { disabled?: boolean }) {
  return (
    <Link
      href={disabled ? '#' : href}
      className={cn(
        'flex flex-1 items-center justify-center',
        { 'pointer-events-none opacity-30': disabled },
        className
      )}
      {...props}
    />
  )
}

export function Pagination({
  board,
  previous,
  next,
  id,
}: {
  board: string
  previous: Nullish<number>
  next: Nullish<number>
  id: Nullish<string>
}) {
  function generateUrl(slugs: Nullish<string | number>[]) {
    return `/bbs/${board}/${slugs.filter(Boolean).join('/')}`
  }

  return (
    <div className="flex h-12 rounded-xl">
      <IconLink href={generateUrl(['1', id])} disabled={!previous}>
        <IconChevronsLeft size={20} stroke={3} />
      </IconLink>
      <IconLink href={generateUrl([previous, id])} disabled={!previous}>
        <IconChevronLeft size={20} stroke={3} />
      </IconLink>
      <IconLink href={generateUrl([next, id])} disabled={!next}>
        <IconChevronRight size={20} stroke={3} />
      </IconLink>
      <IconLink href={generateUrl(['index', id])} disabled={!next}>
        <IconChevronsRight size={20} stroke={3} />
      </IconLink>
    </div>
  )
}
