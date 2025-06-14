import { cn } from '@/modules/cn'

export function Score({ value }: { value: number }) {
  if (!value) return null

  return (
    <span
      className={cn('font-mono font-bold', {
        'text-neutral-600 dark:text-neutral-500': value <= 0,
        'text-lime-600 dark:text-lime-500': 0 < value && value < 10,
        'text-yellow-600 dark:text-yellow-500': 10 <= value,
        'text-red-600 dark:text-red-500': value === 100,
      })}
    >
      {value === 100 ? '爆' : value}
    </span>
  )
}
