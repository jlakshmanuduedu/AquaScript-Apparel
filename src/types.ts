export interface GroundingSource {
  title: string;
  uri: string;
}

export interface MarketRateItem {
  marketName: string;
  modalPrice: string;
  priceRange?: string;
  trend?: 'up' | 'down' | 'stable';
  unit?: string;
}

export interface ParsedSections {
  marketRatesRaw: string;
  weatherRiskRaw: string;
  plantHealthRaw: string;
  actionableStepsRaw: string;
  actionStepsList: string[];
}

export interface AdvisoryReport {
  id: string;
  crop: string;
  region: string;
  specificIssue?: string;
  webScrapedData: string;
  advisoryReport: string;
  parsedSections?: ParsedSections;
  sources: GroundingSource[];
  searchQueries?: string[];
  timestamp: string;
  language?: string;
}

export interface SamplePreset {
  id: string;
  title: string;
  crop: string;
  region: string;
  country: string;
  currency: string;
  issue: string;
  feedData: string;
}
