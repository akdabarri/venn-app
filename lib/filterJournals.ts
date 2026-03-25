import { Journal } from "./types";

// Helper to extract clean keywords from abstract or title
function extractKeywords(text: string): string[] {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "") // Remove punctuation
    .split(/\s+/)
    .filter((word) => word.length > 3); // Only words > 3 chars
}

export function filterJournals(
  journals: Journal[],
  abstract: string,
  title: string,
  freeApcOnly: boolean,
  page: number = 1, // Add pagination
  limit: number = 3  // Only process top 3 first
): Journal[] {
  if (!journals || journals.length === 0) return [];

  const abstractKeywords = extractKeywords(abstract);
  const titleKeywords = extractKeywords(title);
  const allKeywords = [...new Set([...abstractKeywords, ...titleKeywords])]; // Unique keywords

  if (allKeywords.length === 0) return [];

  // 1. Initial Filtering (Fast)
  const basicFiltered = journals.filter((journal) => {
    // APC Filter
    if (freeApcOnly && !journal.is_free_apc) return false;
    return true;
  });

  // 2. Scoring (Heavy - needs limitation)
  const scoredJournals = basicFiltered.map((journal) => {
    let score = 0;
    const journalTitleLower = journal.Title.toLowerCase();
    const journalCatLower = journal.Categories.toLowerCase();

    // Score based on keywords
    allKeywords.forEach((keyword) => {
      // Direct title match gets highest boost
      if (journalTitleLower.includes(keyword)) score += 10;
      // Category match boost
      if (journalCatLower.includes(keyword)) score += 5;
    });

    // SJR Quartile Boost (Q1 > Q2 > Q3 > Q4)
    if (journal["SJR Best Quartile"] === "Q1") score *= 1.5;
    else if (journal["SJR Best Quartile"] === "Q2") score *= 1.3;
    else if (journal["SJR Best Quartile"] === "Q3") score *= 1.1;

    return { journal, score };
  });

  // 3. Sort and Paginate (Final Heavy Step)
  // Sort by score (desc), then H-index (desc)
  const sorted = scoredJournals
    .filter(item => item.score > 0) // Only keep relevant ones
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      
      // FIX: Konversi eksplisit ke Number agar TypeScript tidak protes
      const hIndexA = Number(a.journal["H index"]) || 0;
      const hIndexB = Number(b.journal["H index"]) || 0;
      return hIndexB - hIndexA;
    });

  // Pagination logic: only return the slice needed
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  
  // Only process and return the needed journals
  return sorted.slice(startIndex, endIndex).map(item => item.journal);
}