// app/changelog/page.tsx
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { format, parseISO, formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { 
  GitCommit, 
  GitBranch, 
  Clock, 
  Calendar,
  Code2,
  Zap,
  Bug,
  Sparkles,
  Shield,
  Rocket,
  Hash
} from "lucide-react";

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
 * Commit tipini belirlemek için mesajı analiz eder
 */
function getCommitType(message: string) {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('feat') || lowerMessage.includes('feature') || lowerMessage.includes('add')) {
    return { type: 'feature', icon: Sparkles, color: 'from-emerald-500 to-green-500', label: 'Özellik' };
  }
  if (lowerMessage.includes('fix') || lowerMessage.includes('bug')) {
    return { type: 'bugfix', icon: Bug, color: 'from-red-500 to-rose-500', label: 'Hata Düzeltme' };
  }
  if (lowerMessage.includes('security') || lowerMessage.includes('sec')) {
    return { type: 'security', icon: Shield, color: 'from-orange-500 to-amber-500', label: 'Güvenlik' };
  }
  if (lowerMessage.includes('perf') || lowerMessage.includes('performance') || lowerMessage.includes('optimize')) {
    return { type: 'performance', icon: Zap, color: 'from-yellow-500 to-orange-500', label: 'Performans' };
  }
  if (lowerMessage.includes('release') || lowerMessage.includes('version')) {
    return { type: 'release', icon: Rocket, color: 'from-purple-500 to-violet-500', label: 'Sürüm' };
  }
  if (lowerMessage.includes('refactor') || lowerMessage.includes('clean')) {
    return { type: 'refactor', icon: Code2, color: 'from-blue-500 to-cyan-500', label: 'Refactor' };
  }
  
  return { type: 'general', icon: GitCommit, color: 'from-gray-500 to-slate-500', label: 'Genel' };
}


async function fetchAllCommits(): Promise<Commit[]> {
  const headers = {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    "User-Agent": "MD-Changelog-App",
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <section className="max-w-4xl mx-auto p-8">
          <Card className="border-0 shadow-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <div className="mb-6">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
                  <GitBranch className="h-10 w-10 text-white" />
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-2">
                  Güncellemeler
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  Henüz commit verisi bulunamadı.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    );
  }

  const totalCommits = commits.length;
  const firstCommitDate = commits[commits.length - 1].commit.author.date;
  const lastCommitDate = commits[0].commit.author.date;

  // Commit tiplerini sayalım
  const commitTypes = commits.reduce((acc, commit) => {
    const type = getCommitType(commit.commit.message).type;
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <section className="max-w-5xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/25">
              <GitBranch className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Güncellemeler
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Proje geliştirme süreci ve tüm değişiklikler
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                    <GitCommit className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalCommits}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Toplam Commit</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{commitTypes.feature || 0}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Yeni Özellik</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-red-500 to-rose-600 rounded-lg">
                    <Bug className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{commitTypes.bugfix || 0}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Hata Düzeltme</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-purple-500 to-violet-600 rounded-lg">
                    <Calendar className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {Math.ceil((new Date().getTime() - new Date(firstCommitDate).getTime()) / (1000 * 60 * 60 * 24))}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Aktif Gün</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Date Range */}
          <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 mb-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <Calendar className="h-4 w-4" />
                  <span className="font-medium">İlk Commit:</span>
                  <span>{format(parseISO(firstCommitDate), "d MMMM yyyy", { locale: tr })}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <Clock className="h-4 w-4" />
                  <span className="font-medium">Son Güncelleme:</span>
                  <span>{formatDistanceToNow(parseISO(lastCommitDate), { locale: tr, addSuffix: true })}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Commits Timeline */}
        <Card className="border-0 shadow-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <ScrollArea className="h-[700px] pr-4">
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 opacity-30" />
                
                <div className="space-y-6">
                  {commits.map((commit) => {
                    const commitType = getCommitType(commit.commit.message);
                    const CommitIcon = commitType.icon;
                    const commitDate = parseISO(commit.commit.author.date);
                    const shortSha = commit.sha.substring(0, 7);
                    
                    return (
                      <div key={commit.sha} className="group relative flex items-start gap-4 pl-12">
                        {/* Timeline dot */}
                        <div className="absolute left-4 top-3 z-10">
                          <div className={`
                            p-2 rounded-full bg-gradient-to-r ${commitType.color} shadow-lg 
                            group-hover:scale-110 transition-all duration-300 
                            shadow-${commitType.type === 'feature' ? 'emerald' : commitType.type === 'bugfix' ? 'red' : 'blue'}-500/25
                          `}>
                            <CommitIcon className="h-3 w-3 text-white" />
                          </div>
                        </div>

                        {/* Content */}
                        <Card className="flex-1 border-0 shadow-md bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm group-hover:shadow-lg group-hover:scale-[1.02] transition-all duration-300">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge 
                                    className={`
                                      px-2 py-1 text-xs font-semibold text-white border-0 shadow-sm
                                      bg-gradient-to-r ${commitType.color}
                                    `}
                                  >
                                    {commitType.label}
                                  </Badge>
                                  <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                    <Hash className="h-3 w-3" />
                                    <code className="font-mono">{shortSha}</code>
                                  </div>
                                </div>
                                
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                                  {commit.commit.message.split('\n')[0]}
                                </h3>
                                
                                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                                  <div className="flex items-center gap-2">
                                    <Avatar className="h-6 w-6">
                                      {commit.author?.avatar_url && (
                                        <AvatarImage
                                          src={commit.author.avatar_url}
                                          alt={commit.commit.author.name}
                                        />
                                      )}
                                      <AvatarFallback className="text-xs">
                                        {commit.commit.author.name.charAt(0)}
                                      </AvatarFallback>
                                    </Avatar>
                                    <span className="font-medium">{commit.commit.author.name}</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex flex-col items-end gap-1 text-right">
                                <time className="text-sm font-medium text-gray-900 dark:text-white">
                                  {format(commitDate, "d MMM", { locale: tr })}
                                </time>
                                <time className="text-xs text-gray-500 dark:text-gray-400">
                                  {format(commitDate, "HH:mm")}
                                </time>
                                <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                  {formatDistanceToNow(commitDate, { locale: tr, addSuffix: true })}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    );
                  })}
                </div>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}