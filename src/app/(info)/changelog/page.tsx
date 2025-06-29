// app/changelog/page.tsx
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format, parseISO } from "date-fns";
import { tr } from "date-fns/locale";

interface Commit {
  sha: string;
  commit: {
    message: string;
    author: {
      name: string;
      date: string;
    };
  };
  author: { login: string; avatar_url: string } | null;
}

/**
 * GitHub API varsayılanı 30 satırdır. Tüm commit'leri almak için
 * 100'lük sayfalama yapıyoruz (GitHub max: 100).
 */
async function fetchAllCommits(): Promise<Commit[]> {
  const headers = {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    // İstersek "User-Agent" ekleyebiliriz, GitHub bazen ister.
  };

  const perPage = 100;
  let page = 1;
  let done = false;
  const all: Commit[] = [];

  while (!done) {
    const res = await fetch(
      `https://api.github.com/repos/TheDobrevic/md/commits?per_page=${perPage}&page=${page}`,
      { headers, cache: "no-store" }
    );

    if (!res.ok) throw new Error("Failed to fetch commits");

    const batch: Commit[] = await res.json();
    all.push(...batch);

    if (batch.length < perPage) done = true;
    page += 1;
  }

  return all;
}

export default async function ChangelogPage() {
  const commits = await fetchAllCommits();

  if (!commits.length) {
    return (
      <section className="max-w-3xl mx-auto p-6 text-center">
        <h1 className="text-3xl font-extrabold">Güncellemeler</h1>
        <p className="text-muted-foreground mt-6">
          Henüz commit verisi bulunamadı.
        </p>
      </section>
    );
  }

  const totalCommits = commits.length;
  const firstCommitDate = commits[commits.length - 1].commit.author.date;

  return (
    <section className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-extrabold mb-1">Güncellemeler</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Toplam <span className="font-medium">{totalCommits}</span> commit • İlk
        commit{" "}
        {format(parseISO(firstCommitDate), "d MMMM yyyy", {
          locale: tr,
        })}
      </p>

      {/* 600 px yüksekliğinde scroll'lanabilir alan */}
      <ScrollArea className="h-[600px] rounded-xl border border-border p-4">
        <ol className="relative space-y-8">
          {commits.map((c, idx) => (
            <li key={c.sha} className="pl-6 group">
              {/* Dikey çizgi */}
              {idx < totalCommits - 1 && (
                <span className="absolute left-2 top-0 h-full w-px bg-border" />
              )}

              {/* Düğme/ikon */}
              <span className="absolute left-1 top-[6px] flex h-3.5 w-3.5 items-center justify-center">
                <span className="h-2 w-2 rounded-full bg-primary group-hover:scale-110 transition-transform" />
              </span>

              <div className="flex items-start space-x-4">
                <Avatar className="h-10 w-10 flex-shrink-0">
                  {c.author?.avatar_url && (
                    <AvatarImage
                      src={c.author.avatar_url}
                      alt={c.commit.author.name}
                    />
                  )}
                  <AvatarFallback>
                    {c.commit.author.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <h2 className="text-base font-semibold">
                      {c.commit.message.split("\n")[0]}
                    </h2>
                    <time className="text-xs text-muted-foreground">
                      {format(parseISO(c.commit.author.date), "d MMM yyyy", {
                        locale: tr,
                      })}
                    </time>
                  </div>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    by {c.commit.author.name}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </ScrollArea>
    </section>
  );
}
