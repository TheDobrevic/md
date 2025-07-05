// app/(dashboard)/admin/mangas/SearchInput.tsx
'use client';

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

interface SearchInputProps {
  defaultValue?: string;
}

export default function SearchInput({ defaultValue = '' }: SearchInputProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState(defaultValue);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      if (searchValue) {
        params.set('search', searchValue);
      } else {
        params.delete('search');
      }
      params.set('page', '1');
      router.push(`/admin/mangas?${params.toString()}`);
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchValue, router, searchParams]);

  return (
    <div className="relative flex-1 max-w-md">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <input
        type="text"
        placeholder="Manga ara..."
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        className="w-full pl-10 pr-4 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
      />
    </div>
  );
}