import { GoogleGenAI } from "@google/genai";
import { ComparisonResult, SourceLink } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const searchAndCompareProducts = async (
  query: string,
  location?: string
): Promise<{ data: ComparisonResult; sources: SourceLink[] }> => {
  const model = "gemini-2.5-flash";

  const locationContext = location ? `shipping to ${location}` : "standard shipping";

  const systemInstruction = `
    You are an advanced E-Commerce Price Comparison AI Agent. 
    Your goal is to find the best deals for the user's requested product by searching the web in real-time.

    CORE CAPABILITIES:
    1. TARGETED SEARCH: Search across the top 5-10 most popular and relevant retailers for this specific product category (e.g., for electronics: Best Buy, Newegg, B&H; for home: Wayfair, Home Depot; general: Amazon, Walmart, eBay, Target).
    2. Extract current price, shipping costs, availability, ratings, and specs.
    3. Compare prices based on TOTAL COST (Price + Shipping).
    4. Identify product variations and ensure apples-to-apples comparison.

    OUTPUT JSON FORMAT:
    Return a valid JSON object with this structure:
    {
      "productName": "Exact Product Name & Model",
      "overview": "Quick 1-2 sentence overview. Mention if shipping costs significantly impact the best deal.",
      "listings": [
        {
          "store": "Store Name",
          "price": "50.00",
          "currency": "$",
          "originalPrice": "80.00",
          "discountPercentage": "37%",
          "rating": "4.5",
          "reviewCount": "1,200",
          "availability": "In Stock",
          "shipping": "Free" or "5.99",
          "delivery": "Get it by...",
          "link": null,
          "notes": "Condition (New/Refurb)",
          "totalCost": "55.99"
        }
      ],
      "topDeals": [
        {
          "store": "Store Name",
          "price": "50.00",
          "currency": "$",
          "shipping": "5.99",
          "totalCost": "55.99",
          "discount": "37%",
          "link": null,
          "reason": "Lowest total cost including shipping"
        }
      ],
      "priceAnalysis": {
        "range": "$50 - $75",
        "lowest": "$50",
        "highest": "$75",
        "notes": "Brief comment on price variance and shipping impact."
      },
      "recommendation": "Detailed analysis of the best value option considering total cost (price + shipping), seller reliability, and speed.",
      "alternatives": [
        { "name": "Alternative Product", "priceRange": "$40-$60", "reason": "Cheaper option with similar features" }
      ]
    }

    RULES:
    - Prioritize official retailers and highly reputable marketplaces.
    - CALCULATE "totalCost" by adding price and shipping. If shipping is "Free", totalCost = price.
    - If shipping is unknown, estimate based on retailer norms or leave null, but note it.
    - Rank "topDeals" primarily by "totalCost".
    - Populate 'link' field if a URL is found in the search grounding data.
    - Ensure 'topDeals' contains 1-3 best options.
    - FOCUS: Find listings from 5-10 high-quality, relevant sources.
  `;

  const prompt = `Find current prices and deals for: "${query}". 
  Calculate total cost based on ${locationContext}.
  
  TARGETED SEARCH REQUEST:
  Scan the top 5-10 most relevant e-commerce websites for this specific item.
  Focus on the most popular retailers where this product is typically sold.
  Ensure you extract shipping costs and availability.
  If shipping is not explicitly stated as 'free', try to find the cost for ${location || "US generic location"}.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: systemInstruction,
        temperature: 0.1,
      },
    });

    const text = response.text || "";
    
    // Extract JSON from potential Markdown wrapping
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Failed to parse structured data from AI response.");
    }
    
    const parsedData = JSON.parse(jsonMatch[0]) as ComparisonResult;

    // Extract sources from grounding metadata
    const sources: SourceLink[] =
      response.candidates?.[0]?.groundingMetadata?.groundingChunks
        ?.map((chunk) => {
            if (chunk.web) {
                return { title: chunk.web.title || "Source", uri: chunk.web.uri || "#" };
            }
            return null;
        })
        .filter((item): item is SourceLink => item !== null) || [];

    // Post-process: Try to populate empty links in listings/deals with matching source URIs
    const populateLink = (storeName: string, currentLink: string | null) => {
        if (currentLink) return currentLink;
        const match = sources.find(s => 
            s.title.toLowerCase().includes(storeName.toLowerCase()) || 
            s.uri.toLowerCase().includes(storeName.toLowerCase().replace(/\s/g, ''))
        );
        return match ? match.uri : null;
    };

    parsedData.listings = parsedData.listings.map(listing => ({
        ...listing,
        link: populateLink(listing.store, listing.link)
    }));

    parsedData.topDeals = parsedData.topDeals.map(deal => ({
        ...deal,
        link: populateLink(deal.store, deal.link)
    }));

    return { data: parsedData, sources };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};