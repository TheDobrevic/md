// app/changelog/page.tsx
import React from 'react'

interface Commit {
  sha: string
  commit: {
    message: string
    author: {
      name: string
      date: string
    }
  }
}

export default async function ChangelogPage() {
  // GitHub API call (unauthenticated has rate limits)
  const res = await fetch(
    'https://api.github.com/repos/TheDobrevic/md/commits',
    { cache: 'no-store' }
  )
  if (!res.ok) {
    throw new Error('Failed to fetch commits')
  }
  const commits: Commit[] = await res.json()

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">GÜncellemeler</h1>
      <ul>
        {commits.map((c) => (
          <li key={c.sha} className="mb-4">
            <div className="font-semibold text-gray-900 dark:text-gray-100">
              {c.commit.message.split('\n')[0]}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              by {c.commit.author.name} on{' '}
              {new Date(c.commit.author.date).toLocaleDateString('tr-TR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
