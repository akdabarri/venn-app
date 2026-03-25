export interface Journal {
  Sourceid: string | number;
  Title: string;
  "SJR Best Quartile": string; // "Q1" | "Q2" | "Q3" | "Q4" | "-"
  "H index": number | string;
  Country: string;
  Categories: string;
  is_free_apc: boolean;
}

export interface RecommendationResult {
  journal: Journal;
  aiReasoning: string;
}
