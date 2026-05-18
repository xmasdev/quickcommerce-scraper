import { useState, useEffect } from 'react';
import Header from './components/Header';
import PlatformColumn from './components/PlatformColumn';

// Import your logos from the assets folder
import blinkitLogo from './assets/logo_blinkit.svg';
import zeptoLogo from './assets/logo_zepto.svg';

function App() {
  const [query, setQuery] = useState('Pepsi');
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // New state for sorting
  const [sortOrder, setSortOrder] = useState('default');

  // 🌙 NEW: Dark Mode State
  const [isDarkMode, setIsDarkMode] = useState(true);

  // 🌙 NEW: Apply dark class to the HTML root
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setProducts([])
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error("Server error");
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch products. Is the Python server running?");
    } finally {
      setIsLoading(false);
    }
  };

  // --- Sorting Logic ---
  const sortItems = (items) => {
    if (sortOrder === 'asc') {
      return [...items].sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    }
    if (sortOrder === 'desc') {
      return [...items].sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    }
    return items; // 'default' returns as scraped
  };

  // Filter first, then sort
  const rawBlinkitItems = products.filter(p => p.platform === 'blinkit');
  const rawZeptoItems = products.filter(p => p.platform === 'zepto');

  const blinkitItems = sortItems(rawBlinkitItems);
  const zeptoItems = sortItems(rawZeptoItems);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-slate-950 w-full transition-colors duration-300">
      <Header 
        query={query} 
        setQuery={setQuery} 
        handleSearch={handleSearch} 
        isLoading={isLoading}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
      />

      <main className="flex-1 w-full max-w-[1920px] mx-auto p-4 md:p-8">
        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 border border-red-200">
            {error}
          </div>
        )}

        {/* --- Empty State --- */}
        {!isLoading && products.length === 0 && !error && (
          // 👇 Added dark:bg-slate-900, dark:border-slate-800
          <div className="flex flex-col items-center justify-center py-20 mt-10 text-center bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm max-w-3xl mx-auto transition-colors duration-300">
            <span className="text-7xl mb-6">🛍️</span>
            {/* 👇 Added dark:text-slate-100 */}
            <h2 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">Ready to Compare?</h2>
            {/* 👇 Added dark:text-slate-400 */}
            <p className="text-slate-500 dark:text-slate-400 mt-3 max-w-md mx-auto text-lg">
              Search for an item like "Milk" or "Eggs" above to see real-time prices side-by-side.
            </p>
          </div>
        )}

        {/* Only show the columns if we are loading OR if we have products */}
        {(isLoading || products.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 w-full">
            <PlatformColumn 
              title="Zepto" 
              logoUrl={zeptoLogo} 
              items={zeptoItems} 
              isLoading={isLoading} 
              borderColor="border-indigo-100" 
            />
            <PlatformColumn 
              title="Blinkit" 
              logoUrl={blinkitLogo} 
              items={blinkitItems} 
              isLoading={isLoading} 
              borderColor="border-yellow-200" 
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;