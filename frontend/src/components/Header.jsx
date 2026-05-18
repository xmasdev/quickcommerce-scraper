export default function Header({ query, setQuery, handleSearch, isLoading, sortOrder, setSortOrder, isDarkMode, setIsDarkMode }) {
  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-slate-950 shadow-sm border-b border-gray-200 dark:border-slate-800 transition-colors duration-300">
      <nav className="max-w-[1920px] mx-auto px-6 py-4 flex flex-col lg:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center gap-2">
          <span className="text-2xl">🛒</span>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
            Q-Commerce <span className="text-slate-400 dark:text-slate-500 font-medium">Compare</span>
          </h1>
        </div>
        
        <form onSubmit={handleSearch} className="w-full lg:flex-1 max-w-4xl flex flex-col sm:flex-row gap-3">
          <div className="flex-1 flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for an item..."
              className="flex-1 px-5 py-2.5 rounded-full border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-base outline-none text-slate-900 dark:text-white"
            />
            <button 
              type="submit"
              disabled={isLoading}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-2.5 rounded-full transition-colors disabled:bg-emerald-400 flex items-center justify-center min-w-[120px]"
            >
              {isLoading ? 'Searching...' : 'Compare'}
            </button>
          </div>

          <div className="flex gap-2">
            <select 
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="px-4 py-2.5 rounded-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-medium focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer min-w-[160px]"
            >
              <option value="default">Sort: Default</option>
              <option value="asc">Price: Low to High</option>
              <option value="desc">Price: High to Low</option>
            </select>

            {/* Dark Mode Toggle Button */}
            <button
              type="button"
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-3 rounded-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
              title="Toggle Dark Mode"
            >
              {isDarkMode ? '🌙' : '☀️'}
            </button>
          </div>
        </form>

      </nav>
    </header>
  );
}