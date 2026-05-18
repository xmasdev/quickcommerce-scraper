import ProductCard from './ProductCard';
import SkeletonCard from './SkeletonCard'; // Import the new skeleton

export default function PlatformColumn({ title, logoUrl, items, isLoading, borderColor }) {
  // Create an array of 8 dummy items for the loading state
  const skeletons = Array(8).fill(0);

  return (
    <section className="flex flex-col w-full">
      <div className={`flex items-center gap-3 pb-4 mb-6 border-b-2 ${borderColor} dark:border-opacity-20`}>
        <img src={logoUrl} alt={`${title} logo`} className="h-8 w-auto object-contain" />
        
        {/* 👇 Added dark:text-white so it's readable on dark backgrounds */}
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{title}</h2>
        
        <span className="ml-auto text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
          {isLoading ? 'Searching...' : `${items.length} items`}
        </span>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {/* If loading, show skeletons. Otherwise, show real items. */}
        {isLoading 
          ? skeletons.map((_, index) => <SkeletonCard key={index} />)
          : items.map((product, index) => <ProductCard key={index} product={product} />)
        }
      </div>
    </section>
  );
}