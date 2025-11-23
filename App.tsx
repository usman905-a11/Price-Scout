import React, { useState } from 'react';
import SearchHeader from './components/SearchHeader';
import ComparisonTable from './components/ComparisonTable';
import TopDealsSection from './components/BestDealCard';
import AnalysisView from './components/AnalysisView';
import { SearchState } from './types';
import { Search, AlertTriangle, DollarSign, Clock, Zap, MapPin, Sparkles } from 'lucide-react';

function App() {
  const [searchState, setSearchState] = useState<SearchState>({
    isLoading: false,
    error: null,
    data: null,
    sources: []
  });

  const handleSearch = async (query: string, location?: string) => {
    setSearchState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      // This is the new secure way to call your backend
      const fullPrompt = `You are PriceScout, an expert price comparison shopping agent. Your goal is to find the absolute best, real-time deal for a given product.
      Product to search: "${query}"
      ${location ? `User's location for shipping calculation: "${location}"` : ''}
      
      Perform the following steps:
      1.  Identify the exact product model, configuration, and key specifications.
      2.  Search the top 5-10 most relevant online retailers for this product (e.g., Amazon, Best Buy, Walmart, B&H Photo, official brand store, etc.).
      3.  For each listing, find the price, shipping cost, and stock status. Calculate the total price (price + shipping).
      4.  Format the response as a single JSON object. Do not include any text or markdown formatting before or after the JSON.
      
      The JSON object must have the following structure:
      {
        "productName": "string",
        "overview": "string (A brief 1-2 sentence summary of the findings)",
        "topDeals": [{ "retailer": "string", "totalPrice": "number", "dealType": "string (e.g., 'Best Overall', 'Fastest Shipping')" }],
        "listings": [{ "retailer": "string", "price": "number", "shipping": "string", "totalPrice": "number", "stock": "string", "url": "string" }],
        "analysis": { "summary": "string", "pros": ["string"], "cons": ["string"] },
        "alternatives": [{ "name": "string", "reason": "string" }]
      }`;

      const { data, sources } = await searchAndCompareProducts(fullPrompt);
      setSearchState({
        isLoading: false,
        error: null,
        data,
        sources
      });
    } catch (err) {
      setSearchState({
        isLoading: false,
        error: "We encountered an issue while scouting the web. Please try refining your search terms or try again in a moment.",
        data: null,
        sources: []
      });
    }
  };

  // This function now calls your own backend server
  const searchAndCompareProducts = async (prompt: string) => {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("Backend Error:", errorBody);
      throw new Error('Failed to fetch data from the backend.');
    }

    const text = (await response.json()).response;

    // Find the JSON part of the response
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```|({[\s\S]*})/);
    if (!jsonMatch) {
      console.error("Invalid JSON response from AI:", text);
      throw new Error("The AI returned data in an unexpected format.");
    }
    
    // Use the first captured group that is not null
    const jsonData = JSON.parse(jsonMatch[1] || jsonMatch[2]);
    return { data: jsonData, sources: jsonData.listings.map((l: any) => l.retailer) };
  };

  return (
    <div className="flex flex-col min-h-screen bg-black font-sans text-neutral-100 selection:bg-indigo-500/30">
      
      <SearchHeader onSearch={handleSearch} isLoading={searchState.isLoading} />

      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
        {/* Ambient Background Glow */}
        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[500px] bg-indigo-900/10 rounded-full blur-[120px] pointer-events-none z-0"></div>

        <div className="relative z-10">
            {/* Error State */}
            {searchState.error && (
            <div className="mb-8 bg-red-950/30 border border-red-900/50 rounded-xl p-4 flex items-start gap-3 text-red-300 animate-fade-in backdrop-blur-md">
                <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <p>{searchState.error}</p>
            </div>
            )}

            {/* Empty State */}
            {!searchState.data && !searchState.isLoading && !searchState.error && (
            <div className="text-center py-20 animate-fade-in">
                <div className="bg-neutral-900/40 p-10 rounded-[2rem] shadow-2xl inline-block mb-10 border border-white/5 max-w-2xl backdrop-blur-xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    
                    <div className="flex gap-6 justify-center mb-10 relative z-10">
                        <div className="w-16 h-16 bg-gradient-to-br from-neutral-800 to-neutral-900 border border-white/10 rounded-2xl flex items-center justify-center text-indigo-400 shadow-lg shadow-black/50 rotate-3 transform transition-transform hover:scale-110 hover:shadow-indigo-500/20">
                            <Search className="w-8 h-8" />
                        </div>
                        <div className="w-16 h-16 bg-gradient-to-br from-neutral-800 to-neutral-900 border border-white/10 rounded-2xl flex items-center justify-center text-emerald-400 shadow-lg shadow-black/50 -rotate-3 transform transition-transform hover:scale-110 hover:shadow-emerald-500/20">
                            <DollarSign className="w-8 h-8" />
                        </div>
                        <div className="w-16 h-16 bg-gradient-to-br from-neutral-800 to-neutral-900 border border-white/10 rounded-2xl flex items-center justify-center text-purple-400 shadow-lg shadow-black/50 rotate-3 transform transition-transform hover:scale-110 hover:shadow-purple-500/20">
                            <Zap className="w-8 h-8" />
                        </div>
                    </div>
                    <h2 className="text-4xl font-black text-white mb-4 tracking-tight">PriceScout AI</h2>
                    <p className="text-neutral-400 text-lg leading-relaxed mb-8 max-w-md mx-auto">
                    Your intelligent shopping agent. Instantly search the top 5-10 relevant retailers to find the absolute best real-time deals.
                    </p>
                    <div className="inline-flex items-center gap-2 bg-black/40 px-5 py-2.5 rounded-full text-sm text-neutral-400 border border-white/5">
                    <MapPin className="w-4 h-4 text-indigo-400" />
                    <span>Calculates total cost including shipping</span>
                    </div>
                </div>
                
                <div className="flex flex-wrap justify-center gap-3 text-sm">
                    {["iPhone 15 Pro Max 256GB", "Sony WH-1000XM5", "Nintendo Switch OLED", "Dyson Airwrap"].map((term) => (
                        <button 
                            key={term}
                            onClick={() => handleSearch(term)} 
                            className="bg-neutral-900/50 border border-white/5 text-neutral-300 px-5 py-2.5 rounded-full hover:bg-neutral-800 hover:border-indigo-500/30 hover:text-white transition-all shadow-sm backdrop-blur-sm"
                        >
                        "{term}"
                        </button>
                    ))}
                </div>
            </div>
            )}

            {/* Loading State */}
            {searchState.isLoading && (
                <div className="w-full max-w-3xl mx-auto space-y-12 py-24">
                    <div className="flex flex-col items-center justify-center relative">
                        <div className="relative mb-8">
                            <div className="w-24 h-24 border-4 border-neutral-800 border-t-indigo-500 rounded-full animate-spin"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Sparkles className="w-8 h-8 text-indigo-400 animate-pulse" />
                            </div>
                        </div>
                        <div className="space-y-3 text-center">
                            <h3 className="text-xl font-bold text-white tracking-tight animate-pulse">Scouting the Web...</h3>
                            <p className="text-neutral-500 text-sm font-medium tracking-wide uppercase">
                                Checking Top 5-10 Retailers & Calculating Shipping
                            </p>
                        </div>
                    </div>
                    <div className="w-full bg-neutral-900/50 rounded-full h-1.5 overflow-hidden max-w-md mx-auto">
                         <div className="h-full bg-indigo-600 animate-progress origin-left"></div>
                    </div>
                </div>
            )}

            {/* Results View */}
            {searchState.data && !searchState.isLoading && (
            <div className="space-y-10 animate-fade-in pb-20">
                
                {/* Header: Product Title & Quick Overview */}
                <div className="space-y-5">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-6">
                        <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">{searchState.data.productName}</h2>
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/30 px-4 py-2 rounded-lg border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Live Prices</span>
                        </div>
                    </div>
                    
                    {/* Quick Overview Badge/Text */}
                    {searchState.data.overview && (
                        <div className="bg-gradient-to-r from-neutral-900 to-neutral-900/50 border-l-4 border-indigo-500 rounded-r-xl p-5 text-neutral-300 text-sm leading-relaxed shadow-lg flex gap-4">
                            <InfoIcon className="w-6 h-6 flex-shrink-0 text-indigo-400" />
                            <p className="text-base">{searchState.data.overview}</p>
                        </div>
                    )}
                </div>

                {/* Top Deals Section */}
                <TopDealsSection deals={searchState.data.topDeals} />

                {/* Main Comparison Table */}
                <ComparisonTable listings={searchState.data.listings} />

                {/* Detailed Analysis & Alternatives */}
                <AnalysisView data={searchState.data} sources={searchState.sources} />

            </div>
            )}
        </div>
      </main>

      <footer className="bg-black border-t border-neutral-900 py-12 mt-auto relative z-10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-lg font-bold text-white mb-2">PriceScout AI</p>
          <p className="text-sm text-neutral-600 mb-6 max-w-md mx-auto">
            Powered by Gemini. We aggregate real-time pricing from the top 5-10 most relevant retailers to find you the absolute lowest total cost.
          </p>
          <p className="text-xs text-neutral-700">© {new Date().getFullYear()} PriceScout AI. Prices subject to change.</p>
        </div>
      </footer>
    </div>
  );
}

function InfoIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
    );
}

export default App;