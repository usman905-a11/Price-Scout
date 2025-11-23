import React from 'react';
import { BestDeal } from '../types';
import { Trophy, ArrowRight, Tag, Truck, AlertTriangle } from 'lucide-react';

interface TopDealsProps {
  deals: BestDeal[];
}

const TopDealsSection: React.FC<TopDealsProps> = ({ deals }) => {
  if (!deals || deals.length === 0) return null;

  const topDeal = deals[0];
  const otherDeals = deals.slice(1);

  // Helper to display total cost if available and different from base price
  const renderPriceDetails = (deal: BestDeal, large: boolean = false) => {
    const isFreeShipping = deal.shipping && deal.shipping.toLowerCase().includes('free');
    const hasTotalCost = !!deal.totalCost;
    const totalEqualsPrice = deal.totalCost === deal.price;

    let detailsContent;

    if (hasTotalCost && !totalEqualsPrice) {
        // Case: Total cost is calculated and includes shipping
        detailsContent = (
            <>
                <span>+ {deal.shipping} shipping</span>
                <span className={`font-bold ${large ? 'text-white' : 'text-indigo-400'}`}> = {deal.currency}{deal.totalCost} total</span>
            </>
        );
    } else if (isFreeShipping || (hasTotalCost && totalEqualsPrice)) {
        // Case: Free shipping or Total Cost = Price (implied free/included)
        detailsContent = <span className="flex items-center gap-1 font-medium"><Truck className="w-3.5 h-3.5" /> Free Shipping</span>;
    } else if (deal.shipping) {
        // Case: Shipping cost is known but total cost wasn't calculated for some reason (rare, but fallback)
        detailsContent = <span>+ {deal.shipping} shipping</span>;
    } else {
        // Case: Shipping unknown
        detailsContent = (
            <span className="flex items-center gap-1 text-amber-500/90 italic font-medium">
                <AlertTriangle className="w-3 h-3" /> Shipping costs unavailable
            </span>
        );
    }
    
    return (
        <div className={`flex flex-col ${large ? 'items-end' : 'items-start'}`}>
             <div className={`${large ? 'text-4xl md:text-5xl' : 'text-2xl'} font-black tracking-tighter ${large ? 'text-white' : 'text-white'}`}>
                {deal.currency}{deal.price}
            </div>
            
            <div className={`flex items-center gap-1.5 text-xs ${large ? 'text-indigo-200' : 'text-neutral-500'} mt-1`}>
                {detailsContent}
            </div>
        </div>
    );
  };

  return (
    <div className="space-y-4">
      
      {/* Main Winner Card - Compact Version */}
      <div className="relative group bg-neutral-900 rounded-2xl shadow-xl overflow-hidden border border-neutral-800 p-0.5">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-900 to-black opacity-40 group-hover:opacity-50 transition-opacity duration-500"></div>
        
        {/* Shine Effect */}
        <div className="absolute -top-[100%] left-[15%] w-1/2 h-[200%] bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-[30deg] animate-shine pointer-events-none"></div>

        <div className="relative bg-black/40 backdrop-blur-sm rounded-[0.9rem] p-5 md:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 h-full">
            <div className="space-y-3 max-w-xl flex-1">
                <div className="flex items-center gap-3">
                    <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/30 backdrop-blur-md px-2.5 py-1 rounded-full text-yellow-300 text-[10px] font-bold uppercase tracking-widest shadow-[0_0_10px_rgba(234,179,8,0.2)]">
                        <Trophy className="w-3 h-3" />
                        <span>Best Value</span>
                    </div>
                     {topDeal.discount && <span className="bg-rose-600 px-2 py-0.5 rounded text-[10px] font-bold shadow-lg shadow-rose-900/20 flex items-center gap-1 text-white border border-rose-500"><Tag className="w-3 h-3" /> Save {topDeal.discount}</span>}
                </div>
                
                <div>
                    <h3 className="text-2xl md:text-3xl font-black text-white mb-2 tracking-tight drop-shadow-lg">{topDeal.store}</h3>
                    <p className="text-neutral-300 text-sm font-medium">{topDeal.reason}</p>
                </div>
            </div>

            <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-4">
                <div className="text-left md:text-right">
                    <p className="text-indigo-200 text-[10px] font-bold uppercase tracking-widest mb-0.5 opacity-70">Price</p>
                    {renderPriceDetails(topDeal, true)}
                </div>
                {topDeal.link && (
                    <a href={topDeal.link} target="_blank" rel="noopener noreferrer" className="bg-white text-black hover:bg-neutral-200 px-6 py-2.5 rounded-lg text-sm font-bold transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] hover:scale-[1.02] flex items-center justify-center group/btn whitespace-nowrap">
                        Go to Store <ArrowRight className="ml-2 w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                    </a>
                )}
            </div>
        </div>
      </div>

      {/* Runners Up Grid - Slightly more compact */}
      {otherDeals.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {otherDeals.map((deal, idx) => (
                <div key={idx} className="bg-neutral-900/50 backdrop-blur-sm rounded-xl p-4 border border-white/5 hover:border-indigo-500/30 shadow-lg transition-all flex flex-col justify-between group hover:-translate-y-0.5">
                    <div>
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-[10px] font-bold text-neutral-500 bg-neutral-900 border border-neutral-800 px-2 py-0.5 rounded uppercase tracking-wider">Top Pick</span>
                            {deal.discount && <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/30 border border-emerald-500/20 px-2 py-0.5 rounded flex items-center"><Tag className="w-3 h-3 mr-1"/> {deal.discount}</span>}
                        </div>
                        <h4 className="text-lg font-bold text-neutral-100 mb-1">{deal.store}</h4>
                        <p className="text-xs text-neutral-400 mb-3 leading-relaxed line-clamp-2">{deal.reason}</p>
                    </div>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-white/5 mt-1">
                         {renderPriceDetails(deal, false)}
                        {deal.link ? (
                             <a href={deal.link} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-white hover:bg-indigo-600 transition-colors">
                                <ArrowRight className="w-3.5 h-3.5" />
                             </a>
                        ) : (
                            <span className="text-neutral-600 text-[10px] italic">No Link</span>
                        )}
                    </div>
                </div>
            ))}
        </div>
      )}

    </div>
  );
};

export default TopDealsSection;