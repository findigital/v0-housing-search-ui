# Housing Search AI Interface

An elegant AI-powered housing search interface built with Next.js, designed to work with a FastAPI/LangChain backend.

## Features

- **Manual Housing Request Input**: Submit detailed housing requests with location and budget
- **Real-time Agent Processing**: Watch LangChain agents work in real-time via WebSocket
- **Workflow Progress Tracking**: Visual representation of the multi-agent workflow
- **Mapbox Integration**: View location data and search boundaries
- **Search Criteria Fine-tuning**: Human-in-the-loop editing of extracted criteria
- **LLM-Scored Results**: View homes with AI-generated match scores, pros/cons analysis
- **Apify Job Status**: Monitor listing scraping progress
- **Duplicate Detection**: See duplicate homes found across sources
- **Supabase Confirmation**: Verify data storage status
- **Search History**: Browse and revisit previous searches

## Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Backend Integration**: FastAPI REST API + WebSocket
- **AI Framework**: LangChain (backend)

## Getting Started

### Prerequisites

- Node.js 18+ 
- A running FastAPI backend (see backend setup)

### Installation

1. Clone the repository
2. Install dependencies:

\`\`\`bash
npm install
\`\`\`

3. Create a `.env.local` file:

\`\`\`bash
cp .env.local.example .env.local
\`\`\`

4. Update the API URL in `.env.local`:

\`\`\`env
NEXT_PUBLIC_API_URL=http://localhost:8000
\`\`\`

5. Run the development server:

\`\`\`bash
npm run dev
\`\`\`

6. Open [http://localhost:3000](http://localhost:3000)

## Backend API Requirements

Your FastAPI backend should implement the following endpoints:

### REST Endpoints

- `POST /api/search/start` - Start a new housing search
  - Body: `{ request: string, location: string, budget: string }`
  - Returns: `{ searchId: string }`

- `GET /api/search/{searchId}/status` - Get search status
  - Returns: Agent statuses, progress, etc.

- `GET /api/search/{searchId}/results` - Get search results
  - Returns: `{ homes: Home[], duplicatesFound: number, savedToSupabase: boolean }`

- `PUT /api/search/{searchId}/criteria` - Update search criteria (human-in-the-loop)
  - Body: Updated SearchCriteria object

- `GET /api/search/history` - Get search history
  - Returns: Array of SearchHistoryItem

- `GET /api/apify/job/{jobId}/status` - Get Apify job status
  - Returns: `{ status: string, progress: number, itemsScraped: number }`

### WebSocket Endpoint

- `WS /ws/search/{searchId}` - Real-time agent updates
  - Sends JSON messages with type and data:
    - `agent_update` - Agent status changes
    - `criteria_update` - Extracted search criteria
    - `mapbox_update` - Location processing results
    - `apify_update` - Apify job updates
    - `results_update` - Final results and Supabase confirmation

## Project Structure

\`\`\`
├── app/
│   ├── page.tsx              # Main application page
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles with design tokens
├── components/
│   ├── housing-request-form.tsx    # Search input form
│   ├── agent-dashboard.tsx         # Main dashboard with tabs
│   ├── workflow-progress.tsx       # Workflow visualization
│   ├── search-criteria-panel.tsx   # Criteria editing
│   ├── mapbox-data-view.tsx        # Location data display
│   ├── apify-job-status.tsx        # Apify status widget
│   ├── home-results-list.tsx       # Results display
│   ├── search-history.tsx          # History view
│   └── ui/                         # shadcn/ui components
├── lib/
│   ├── api.ts                # FastAPI client
│   └── types.ts              # TypeScript types
└── public/                   # Static assets
\`\`\`

## Design System

The interface uses a professional color system with design tokens:

- **Primary**: Blue (#2563eb) for actions and highlights
- **Neutrals**: Grays for backgrounds and text hierarchy
- **Accents**: Green (success), Red (errors), Yellow (warnings)
- **Typography**: Geist Sans for UI, Geist Mono for code
- **Layout**: Flexbox-first with responsive grid layouts

## Development

### Adding New Features

1. Update TypeScript types in `lib/types.ts`
2. Add API methods in `lib/api.ts`
3. Create/update components in `components/`
4. Test with your FastAPI backend

### WebSocket Message Format

\`\`\`typescript
{
  type: "agent_update" | "criteria_update" | "mapbox_update" | "results_update" | "apify_update",
  data: any // Type-specific data
}
\`\`\`

## License

MIT
