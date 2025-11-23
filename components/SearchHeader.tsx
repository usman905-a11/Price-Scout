import React, { useState } from 'react';
import { Search, ShoppingBag, Loader2, MapPin } from 'lucide-react';

interface SearchHeaderProps {
  onSearch: (query: string, location?: string) => void;
  isLoading: boolean;
}

const SearchHeader: React.FC<SearchHeaderProps> = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query, location);
    }
  };

  return (
    <div className="w-full bg-black/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer shrink-0 group" onClick={() => window.location.reload()}>
            <div className="bg-neutral-900 p-2.5 rounded-xl border border-white/10 group-hover:border-indigo-500/50 transition-colors duration-300">
              <ShoppingBag className="w-6 h-6 text-white group-hover:text-indigo-400 transition-colors" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight group-hover:text-indigo-400 transition-colors">PriceScout</h1>
              <p className="text-[10px] text-neutral-500 font-medium uppercase tracking-widest hidden sm:block">AI Deal Agent</p>
            </div>
          </div>

          {/* Search Bar Form */}
          <form onSubmit={handleSubmit} className="flex-1 max-w-4xl w-full flex flex-col sm:flex-row gap-2.5">
            
            {/* Main Search Input */}
            <div className="relative flex-grow group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-neutral-500 group-focus-within:text-indigo-400 transition-colors" />
              </div>
              <input
                type="text"
                className="block w-full pl-12 pr-4 py-3 border border-white/10 rounded-xl leading-5 bg-neutral-900/50 text-neutral-100 placeholder-neutral-600 focus:outline-none focus:bg-neutral-900 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500/50 transition-all shadow-inner"
                placeholder="Search product (e.g. 'PS5 Slim Console')"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                disabled={isLoading}
              />
            </div>

            {/* Location Input (Optional) */}
            <div className="relative w-full sm:w-56 group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-neutral-500 group-focus-within:text-indigo-400 transition-colors" />
                </div>
                <input
                    type="text"
                    className="block w-full pl-12 pr-4 py-3 border border-white/10 rounded-xl leading-5 bg-neutral-900/50 text-neutral-100 placeholder-neutral-600 focus:outline-none focus:bg-neutral-900 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500/50 transition-all shadow-inner"
                    placeholder="Zip / City"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    disabled={isLoading}
                />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="px-8 py-3 bg-white text-black hover:bg-neutral-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-white disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.1)] shrink-0"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="hidden sm:inline">Scouting...</span>
                </>
              ) : (
                'Find Deals'
              )}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default SearchHeader;