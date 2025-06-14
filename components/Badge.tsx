import { PropsWithChildren, ReactNode } from 'react'

export function Badge({
  icon,
  children,
}: PropsWithChildren<{
  icon: ReactNode
}>) {
  return (
    <span className="inline-flex items-center gap-0.5 rounded-lg bg-neutral-300 px-1.5 py-0.5 text-xs font-semibold text-neutral-600">
      {icon}
      {children}
    </span>
  )
}
