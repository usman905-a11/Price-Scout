import React from 'react';
import { ExternalLink, Star, Truck, Package, ArrowUpRight, AlertTriangle } from 'lucide-react';
import { ProductListing } from '../types';

interface ComparisonTableProps {
  listings: ProductListing[];
}

const ComparisonTable: React.FC<ComparisonTableProps> = ({ listings }) => {
  if (listings.length === 0) {
    return (
      <div className="p-10 text-center bg-neutral-900/30 rounded-2xl border border-dashed border-neutral-800">
        <p className="text-neutral-500 font-medium">No direct comparison listings found. Check the alternatives section.</p>
      </div>
    );
  }

  // Sort listings by Total Cost (or Price if total not available)
  const sortedListings = [...listings].sort((a, b) => {
    // Helper to extract numeric price
    const getPrice = (str: string | null | undefined) => {
        if (!str) return Infinity;
        const val = parseFloat(str.replace(/[^0-9.]/g, ''));
        return isNaN(val) ? Infinity : val;
    };

    const costA = a.totalCost ? getPrice(a.totalCost) : getPrice(a.price);
    const costB = b.totalCost ? getPrice(b.totalCost) : getPrice(b.price);
    
    return costA - costB;
  });

  return (
    <div className="bg-neutral-900/20 backdrop-blur-md rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
      <div className="px-8 py-6 border-b border-white/5 bg-neutral-900/40 flex justify-between items-center">
        <div>
            <h3 className="font-bold text-xl text-white">Market Comparison</h3>
            <p className="text-sm text-neutral-500 mt-1">Found {listings.length} stores with stock</p>
        </div>
      </div>
      <div className="overflow-x-auto scrollbar-hide">
        <table className="min-w-full divide-y divide-white/5">
          <thead className="bg-neutral-950">
            <tr>
              <th scope="col" className="px-8 py-5 text-left text-[11px] font-bold text-neutral-500 uppercase tracking-widest">Store</th>
              <th scope="col" className="px-8 py-5 text-left text-[11px] font-bold text-neutral-500 uppercase tracking-widest">Total Cost</th>
              <th scope="col" className="px-8 py-5 text-left text-[11px] font-bold text-neutral-500 uppercase tracking-widest hidden sm:table-cell">Shipping & Delivery</th>
              <th scope="col" className="px-8 py-5 text-left text-[11px] font-bold text-neutral-500 uppercase tracking-widest hidden md:table-cell">Status</th>
              <th scope="col" className="px-8 py-5 text-right text-[11px] font-bold text-neutral-500 uppercase tracking-widest">Action</th>
            </tr>
          </thead>
          <tbody className="bg-black/20 divide-y divide-white/5">
            {sortedListings.map((item, index) => (
              <tr key={index} className="hover:bg-neutral-800/30 transition-colors group">
                <td className="px-8 py-5 whitespace-nowrap">
                  <div className="flex flex-col">
                    <div className="text-base font-bold text-neutral-100 group-hover:text-indigo-300 transition-colors">{item.store}</div>
                    <div className="flex items-center gap-2 mt-2">
                        {item.rating && (
                            <div className="flex items-center text-xs font-medium text-neutral-400 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
                            <Star className="w-3 h-3 fill-amber-500 text-amber-500 mr-1.5" />
                            <span className="text-neutral-200">{item.rating}</span>
                            {item.reviewCount && <span className="text-neutral-500 ml-1">({item.reviewCount})</span>}
                            </div>
                        )}
                    </div>
                    {item.notes && (
                         <span className="text-[10px] uppercase tracking-wide text-indigo-300 mt-2 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded w-fit">{item.notes}</span>
                    )}
                  </div>
                </td>
                <td className="px-8 py-5 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span className="text-xl font-bold text-white tabular-nums tracking-tight">{item.currency}{item.price}</span>
                    
                    {/* Shipping / Total Cost Display */}
                    <div className="text-xs mt-1">
                        {item.totalCost && item.totalCost !== item.price ? (
                            <span className="font-semibold text-emerald-400 bg-emerald-950/30 px-2 py-0.5 rounded">Total: {item.currency}{item.totalCost}</span>
                        ) : (item.shipping && item.shipping.toLowerCase().includes('free')) || (item.totalCost && item.totalCost === item.price) ? (
                            <span className="text-emerald-500 font-medium">Free Shipping</span>
                        ) : item.shipping ? (
                            <span className="text-neutral-500">+ {item.shipping} shipping</span>
                        ) : (
                            <span className="text-amber-500/90 font-medium italic flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3" /> Costs unavailable
                            </span>
                        )}
                    </div>

                    {item.discountPercentage && (
                      <span className="text-[10px] font-bold text-rose-400 mt-2 block">
                        Save {item.discountPercentage}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-8 py-5 hidden sm:table-cell align-top">
                  <div className="flex flex-col space-y-2 mt-1">
                    {item.shipping ? (
                      <div className="flex items-center text-sm text-neutral-300">
                        <Truck className="w-4 h-4 mr-2 text-neutral-500" />
                        {item.shipping}
                      </div>
                    ) : (
                        <div className="flex items-center text-sm text-neutral-500 italic">
                            <AlertTriangle className="w-4 h-4 mr-2 text-neutral-600" />
                            Shipping info n/a
                        </div>
                    )}
                    {item.delivery && (
                        <div className="flex items-center text-xs text-neutral-400">
                             <Package className="w-4 h-4 mr-2 text-neutral-500" />
                            {item.delivery}
                        </div>
                    )}
                  </div>
                </td>
                <td className="px-8 py-5 whitespace-nowrap hidden md:table-cell align-top">
                   <div className="flex items-center mt-1">
                    {item.availability?.toLowerCase().includes('in stock') ? (
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]"></span>
                            In Stock
                        </span>
                    ) : item.availability?.toLowerCase().includes('out') ? (
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                            Out of Stock
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                             <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                             {item.availability || 'Check Site'}
                        </span>
                    )}
                   </div>
                </td>
                <td className="px-8 py-5 whitespace-nowrap text-right align-middle">
                  {item.link ? (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-neutral-800 text-neutral-400 hover:bg-white hover:text-black transition-all duration-300"
                    >
                      <ArrowUpRight className="w-5 h-5" />
                    </a>
                  ) : (
                    <span className="text-neutral-700 text-xs italic">No Link</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComparisonTable;