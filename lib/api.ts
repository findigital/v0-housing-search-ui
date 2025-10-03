const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export class HousingSearchAPI {
  private baseUrl: string

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl
  }

  // Start a new housing search
  async startSearch(request: {
    request: string
    location: string
    budget: string
  }): Promise<{ searchId: string }> {
    const response = await fetch(`${this.baseUrl}/api/search/start`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      throw new Error(`Failed to start search: ${response.statusText}`)
    }

    return response.json()
  }

  // Get search status
  async getSearchStatus(searchId: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/api/search/${searchId}/status`)

    if (!response.ok) {
      throw new Error(`Failed to get search status: ${response.statusText}`)
    }

    return response.json()
  }

  // Get search results
  async getSearchResults(searchId: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/api/search/${searchId}/results`)

    if (!response.ok) {
      throw new Error(`Failed to get search results: ${response.statusText}`)
    }

    return response.json()
  }

  // Update search criteria (human-in-the-loop)
  async updateSearchCriteria(searchId: string, criteria: any): Promise<void> {
    const response = await fetch(`${this.baseUrl}/api/search/${searchId}/criteria`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(criteria),
    })

    if (!response.ok) {
      throw new Error(`Failed to update criteria: ${response.statusText}`)
    }
  }

  // Get search history
  async getSearchHistory(): Promise<any[]> {
    const response = await fetch(`${this.baseUrl}/api/search/history`)

    if (!response.ok) {
      throw new Error(`Failed to get search history: ${response.statusText}`)
    }

    return response.json()
  }

  // Create WebSocket connection for real-time updates
  createWebSocket(searchId: string): WebSocket {
    const wsUrl = this.baseUrl.replace("http", "ws")
    return new WebSocket(`${wsUrl}/ws/search/${searchId}`)
  }
}

export const api = new HousingSearchAPI()
