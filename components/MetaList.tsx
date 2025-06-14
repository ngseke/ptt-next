import { ReactNode } from 'react'

export function MetaList({ list }: { list: ReactNode[] }) {
  return (
    <ul className="flex text-sm text-neutral-700 dark:text-neutral-300">
      {list.filter(Boolean).map((item, index) => (
        <li
          key={index}
          className="after:mx-1.5 after:opacity-50 after:content-['•'] last:after:hidden empty:hidden"
        >
          {item}
        </li>
      ))}
    </ul>
  )
}
