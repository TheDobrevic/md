// app/changelog/page.tsx
import React from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { format, parseISO } from 'date-fns';
import { tr } from 'date-fns/locale'


interface Commit {
  sha: string
  commit: {
    message: string
    author: {
      name: string
      date: string
    }
  }
  author: { login: string; avatar_url: string } | null
}

export default async function ChangelogPage() {
  const res = await fetch(
    'https://api.github.com/repos/TheDobrevic/md/commits',
    { cache: 'no-store' }
  )
  if (!res.ok) throw new Error('Failed to fetch commits')
  const commits: Commit[] = await res.json()

  return (
    <section className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-extrabold mb-6">Güncellemeler</h1>
      <ScrollArea className="h-[600px] rounded-md border border-gray-200 dark:border-gray-700 p-4">
        <ol className="relative">
          {commits.map((c, idx) => (
            <li key={c.sha} className="flex items-start space-x-4 mb-8">
              <Avatar className="w-10 h-10">
                {c.author?.avatar_url && (
                  <AvatarImage src={c.author.avatar_url} alt={c.commit.author.name} />
                )}
                <AvatarFallback>
                  {c.commit.author.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {c.commit.message.split('\n')[0]}
                  </h2>
                  <time className="text-sm text-gray-500 dark:text-gray-400">
                    {format(parseISO(c.commit.author.date), 'd MMM yyyy', { locale: tr })}
                  </time>
                </div>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                  by {c.commit.author.name}
                </p>
                {idx < commits.length - 1 && (
                  <div className="mt-4 border-t border-gray-200 dark:border-gray-700" />
                )}
              </div>
            </li>
          ))}
        </ol>
      </ScrollArea>
    </section>
  )
}
