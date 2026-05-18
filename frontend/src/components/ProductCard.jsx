export default function ProductCard({ product }) {
  // If we have a URL, render an anchor tag. Otherwise, a standard div.
  const CardWrapper = product.product_url ? 'a' : 'div';
  const linkProps = product.product_url ? { 
    href: product.product_url, 
    target: "_blank", 
    rel: "noopener noreferrer" 
  } : {};

  return (
    <CardWrapper 
      {...linkProps} 
      className="block relative flex flex-col bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-emerald-500 dark:hover:border-emerald-500 transition-all duration-200 cursor-pointer group"
    >
      {/* Image Container */}
      <div className="aspect-square w-full rounded-xl bg-white dark:bg-slate-800/50 flex items-center justify-center p-2 mb-4 overflow-hidden">
        {product.image_url ? (
          <img 
            src={product.image_url} 
            alt={product.name} 
            className="h-full w-full object-contain group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="text-gray-400 text-sm">No Image</div>
        )}
      </div>

      {/* Out of Stock Overlay */}
      {!product.in_stock && (
        <div className="absolute inset-0 bg-white/70 dark:bg-slate-900/70 backdrop-blur-[1px] flex items-center justify-center rounded-2xl z-10">
          <span className="bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300 font-bold px-3 py-1 rounded-full text-xs uppercase tracking-wider border border-red-200 dark:border-red-800">
            Out of Stock
          </span>
        </div>
      )}

      {/* Details */}
      <div className="flex flex-col flex-1 justify-between gap-2">
        <h3 className="text-sm font-medium text-slate-800 dark:text-slate-200 line-clamp-2 leading-snug">
          {product.name}
        </h3>
        
        <div>
          <div className="flex items-end gap-2">
            <p className="text-lg font-bold text-slate-900 dark:text-white">₹{product.price}</p>
            {product.quantity && (
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">{product.quantity}</p>
            )}
          </div>
        </div>
      </div>
    </CardWrapper>
  );
}