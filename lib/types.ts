export interface HousingRequest {
  request: string
  location: string
  budget: string
}

export interface SearchResponse {
  searchId: string
  status: string
}

export interface AgentStatus {
  id: string
  name: string
  status: "idle" | "working" | "completed" | "error"
  currentTask: string
  output?: string
  startTime?: number
  endTime?: number
}

export interface SearchCriteria {
  bedrooms: { min: number; max: number }
  bathrooms: { min: number; max: number }
  priceRange: { min: number; max: number }
  squareFeet: { min: number; max: number }
  propertyTypes: string[]
  mustHave: string[]
  niceToHave: string[]
  dealBreakers: string[]
}

export interface MapboxData {
  center: { lat: number; lng: number }
  boundingBox: {
    north: number
    south: number
    east: number
    west: number
  }
  radius: number
  neighborhoods: string[]
}

export interface ApifyJobStatus {
  jobId: string
  status: "READY" | "RUNNING" | "SUCCEEDED" | "FAILED"
  progress: number
  itemsScraped: number
  startedAt?: string
  finishedAt?: string
}

export interface Home {
  id: string
  address: string
  city: string
  state: string
  zip: string
  price: number
  bedrooms: number
  bathrooms: number
  squareFeet: number
  propertyType: string
  yearBuilt: number
  images: string[]
  listingUrl: string
  score: number
  matchPercentage: number
  pros: string[]
  cons: string[]
  llmAnalysis: string
  source: string
}

export interface SearchResults {
  homes: Home[]
  duplicatesFound: number
  savedToSupabase: boolean
  totalFound: number
}

export interface AgentUpdate {
  type: "agent_update" | "criteria_update" | "mapbox_update" | "results_update" | "apify_update"
  data: any
}

export interface SearchHistoryItem {
  id: string
  request: string
  location: string
  budget: string
  createdAt: string
  status: "completed" | "in_progress" | "failed"
  homesFound: number
}
