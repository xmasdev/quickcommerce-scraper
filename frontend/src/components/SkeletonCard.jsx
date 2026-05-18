export default function SkeletonCard() {
  return (
    // 👇 Card wrapper
    <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-4 shadow-sm animate-pulse flex flex-col h-[280px] transition-colors duration-300">
      
      {/* Fake Image Placeholder */}
      <div className="aspect-square w-full rounded-xl bg-gray-200 dark:bg-slate-800 mb-4"></div>
      
      {/* Fake Text Lines */}
      <div className="flex-1 space-y-3 py-1 flex flex-col">
        <div className="h-4 bg-gray-200 dark:bg-slate-800 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 dark:bg-slate-800 rounded w-1/2"></div>
        
        {/* Fake Price/Quantity at the bottom */}
        <div className="mt-auto pt-4 flex justify-between items-end">
          <div className="h-6 bg-gray-200 dark:bg-slate-800 rounded w-1/3"></div>
          <div className="h-3 bg-gray-200 dark:bg-slate-800 rounded w-1/4"></div>
        </div>
      </div>
    </div>
  );
}