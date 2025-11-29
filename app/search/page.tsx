"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import Navbar from "../components/Navbar";
import NewsFeed from "../components/NewsFeed";

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearching(true);
    }
  };

  return (
    <main className="min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto mb-8">
          <h1 className="text-3xl font-bold text-[hsl(var(--foreground))] mb-6">Search News</h1>
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for news..."
                className="w-full px-4 py-2 rounded-lg bg-[hsl(var(--card))] text-[hsl(var(--foreground))] border border-[hsl(var(--border))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]"
              />
              <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <button
              type="submit"
              className="px-6 py-2 bg-[hsl(var(--primary))] hover:bg-[hsl(var(--accent))] text-[hsl(var(--foreground))] rounded-lg transition-colors"
            >
              Search
            </button>
          </form>
        </div>

        {isSearching && searchQuery && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-200 mb-4">
              Search Results for "{searchQuery}"
            </h2>
            <NewsFeed query={searchQuery} />
          </div>
        )}
      </div>
    </main>
  );
}
