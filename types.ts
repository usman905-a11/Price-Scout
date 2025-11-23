export interface ProductListing {
  store: string;
  price: string;
  currency: string;
  originalPrice: string | null;
  discountPercentage: string | null;
  rating: string | null;
  reviewCount: string | null;
  availability: string;
  shipping: string | null;
  delivery: string | null;
  link: string | null;
  notes: string | null; // e.g. "Refurbished", "Open Box", "International Version"
  totalCost?: string | null; // Price + Shipping
}

export interface BestDeal {
  store: string;
  price: string;
  currency: string;
  shipping?: string | null;
  totalCost?: string | null;
  discount: string | null;
  link: string | null;
  reason: string;
}

export interface AlternativeProduct {
  name: string;
  priceRange: string;
  reason: string;
}

export interface PriceAnalysis {
  range: string;
  lowest: string;
  highest: string;
  notes: string;
}

export interface ComparisonResult {
  productName: string;
  overview: string;
  listings: ProductListing[];
  topDeals: BestDeal[];
  priceAnalysis: PriceAnalysis;
  recommendation: string;
  alternatives: AlternativeProduct[];
}

export interface SourceLink {
  title: string;
  uri: string;
}

export interface SearchState {
  isLoading: boolean;
  error: string | null;
  data: ComparisonResult | null;
  sources: SourceLink[];
}
