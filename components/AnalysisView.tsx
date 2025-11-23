import React from 'react';
import { ComparisonResult, SourceLink } from '../types';
import { Info, Globe, ShieldCheck, TrendingUp, Search, BarChart3 } from 'lucide-react';

interface AnalysisViewProps {
  data: ComparisonResult;
  sources: SourceLink[];
}

const AnalysisView: React.FC<AnalysisViewProps> = ({ data, sources }) => {
  return (
    <div className="space-y-6">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Detailed Recommendation */}
            <div className="lg:col-span-2 bg-neutral-900/30 backdrop-blur-md rounded-3xl shadow-lg border border-white/5 p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <ShieldCheck className="w-24 h-24 text-indigo-500" />
                </div>
                <div className="flex items-center gap-3 mb-6 relative z-10">
                    <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
                        <ShieldCheck className="w-6 h-6 text-indigo-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Agent Recommendation</h3>
                </div>
                <div className="prose prose-invert max-w-none text-neutral-300 text-sm leading-7 relative z-10">
                    {data.recommendation}
                </div>
            </div>

            {/* Price Analysis */}
            <div className="bg-neutral-900/30 backdrop-blur-md rounded-3xl shadow-lg border border-white/5 p-8 flex flex-col justify-between">
                <div>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
                            <TrendingUp className="w-6 h-6 text-purple-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white">Price Analysis</h3>
                    </div>
                    
                    <div className="space-y-6">
                        <div>
                            <p className="text-[10px] text-neutral-500 uppercase font-bold tracking-widest mb-2">Market Range</p>
                            <p className="text-3xl font-black text-white tracking-tight">{data.priceAnalysis.range}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-emerald-900/10 border border-emerald-500/10 p-4 rounded-2xl">
                                <p className="text-xs text-emerald-400 mb-1 font-bold uppercase">Lowest Found</p>
                                <p className="font-bold text-emerald-300 text-lg">{data.priceAnalysis.lowest}</p>
                            </div>
                            <div className="bg-rose-900/10 border border-rose-500/10 p-4 rounded-2xl">
                                <p className="text-xs text-rose-400 mb-1 font-bold uppercase">Highest Found</p>
                                <p className="font-bold text-rose-300 text-lg">{data.priceAnalysis.highest}</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                {data.priceAnalysis.notes && (
                    <div className="mt-6 flex gap-3 text-xs text-neutral-400 bg-neutral-950/50 p-4 rounded-xl border border-white/5">
                        <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-neutral-500" />
                        <p>{data.priceAnalysis.notes}</p>
                    </div>
                )}
            </div>
        </div>

        {/* Alternatives */}
        {data.alternatives && data.alternatives.length > 0 && (
            <div className="bg-neutral-900/20 border border-white/5 rounded-3xl p-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-neutral-800 rounded-lg border border-white/10">
                        <Search className="w-5 h-5 text-neutral-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Smart Alternatives</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {data.alternatives.map((alt, idx) => (
                        <div key={idx} className="border border-white/5 rounded-2xl p-6 hover:border-indigo-500/30 transition-all bg-neutral-900/40 hover:bg-neutral-900/60 group">
                            <h4 className="font-bold text-lg text-white mb-2 group-hover:text-indigo-300 transition-colors">{alt.name}</h4>
                            <p className="text-sm text-indigo-400 font-bold mb-3">{alt.priceRange}</p>
                            <p className="text-xs text-neutral-400 leading-relaxed">{alt.reason}</p>
                        </div>
                    ))}
                </div>
            </div>
        )}
        
        {/* Sources Footer */}
        <div className="border-t border-white/5 pt-8 mt-8">
            <h4 className="text-[10px] font-bold text-neutral-600 uppercase mb-4 flex items-center gap-2 tracking-widest">
                <Globe className="w-3 h-3" /> Scanned Sources ({sources.length})
            </h4>
            <div className="flex flex-wrap gap-2">
                {sources.map((source, idx) => (
                    <a 
                        key={idx} 
                        href={source.uri} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-medium text-neutral-500 bg-neutral-900 border border-neutral-800 hover:border-neutral-600 hover:text-neutral-300 px-3 py-1.5 rounded-full transition-colors truncate max-w-[200px]"
                    >
                        {source.title}
                    </a>
                ))}
            </div>
        </div>
    </div>
  );
};

export default AnalysisView;