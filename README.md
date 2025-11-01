# Trade Superhighways: Global Trade Intel

Advanced analytics SPA for global trade intelligence with holographic glass UI aesthetic.

## Features

- **Geo-Intelligence Map**: Pure SVG-based world map with animated trade flow arcs
- **Risk & Opportunities Panel**: Real-time risk scoring and anomaly detection
- **Routes Analysis**: Comprehensive trade corridor data with filtering
- **Scenario Planning**: "What-if" analysis with transparent calculation formulas
- **Export Insights**: Generate comprehensive markdown reports
- **Share State**: URL-based filter sharing

## Tech Stack

- **Next.js 16** (App Router) with static export
- **TypeScript** for type safety
- **Tailwind CSS v4** for styling
- **shadcn/ui** components
- **Pure SVG rendering** (no external API keys or WebGL required)

## Vercel-Safe Architecture

This application is designed for seamless Vercel deployment with **zero configuration**:

### Static Export
- Configured with `output: 'export'` in next.config.mjs
- No server-side routes or server actions
- All data is client-side or loaded from static JSON files

### No External Dependencies
- **No map libraries required**: Pure SVG rendering with custom projection
- **No WebGL requirements**: All visualizations work in SSR and static export
- **No API keys needed**: All data is synthetic and loaded from /public/mock
- **No server dependencies**: 100% client-side rendering

### Client-Side Rendering
- Map and animations render only on client (no SSR issues)
- GeoJSON and mock data loaded at runtime from /public
- Dynamic imports used for heavy components

## Getting Started

### Development

\`\`\`bash
npm install
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000)

### Build for Production

\`\`\`bash
npm run build
\`\`\`

This generates a static export in the `out` directory.

## Deploy to Vercel

### Option 1: GitHub Integration (Recommended)
1. Push code to GitHub
2. Import repository in Vercel
3. Deploy automatically - no configuration needed!

### Option 2: Vercel CLI
\`\`\`bash
npm install -g vercel
vercel
\`\`\`

### Option 3: Direct from v0
Click the "Publish" button in v0 to deploy directly to Vercel.

## Keyboard Shortcuts

- `s` - Open Scenarios panel
- `e` - Export insights as markdown

## Mock Data

All data is synthetic and located in `/public/mock`:
- `ports.json` - Global port nodes with coordinates and volumes
- `routes.json` - Trade corridors with commodities and risk scores
- `commodities.json` - Product categories with tariff data
- `risks.json` - Regional risk factors and anomalies
- `scenarios.json` - Pre-configured "what-if" scenarios

## Replacing Mock Data with Real Sources

To transition from synthetic demo data to real trade intelligence:

### 1. Data Loading Strategy

The app currently uses TypeScript data from `lib/mock-data.ts`. To replace with real data:

**Option A: Static JSON Files (Recommended for Vercel)**
```typescript
// In lib/data-loader.ts
export async function loadTradeRoutes() {
  if (typeof window === 'undefined') return []
  const res = await fetch('/mock/routes.json')
  return res.json()
}
```

**Option B: Client-Side Fetch (Works with static export)**
```typescript
// Fetch from external service directly in useEffect
useEffect(() => {
  fetch('https://your-api.com/trade-routes')
    .then(res => res.json())
    .then(setRoutes)
}, [])
```

### 2. Update Components

Replace mock data imports in:
- `components/world-map.tsx` - Load routes and chokepoints
- `components/routes-table.tsx` - Load filtered route data
- `components/risk-opportunities-panel.tsx` - Load risks and opportunities
- `components/scenarios-dialog.tsx` - Load scenario configurations

### 3. Data Schema Compatibility

Ensure real data matches these interfaces (from `lib/mock-data.ts`):
- `TradeRoute` - origin, destination, volume, risk, status, commodity
- `Chokepoint` - lat, lng, riskLevel, throughput, controllingNation
- `RiskAlert` - severity, category, impact, probability, timeframe
- `Scenario` - category, probability, impact calculations

### 4. Static Export Considerations

Since the app uses `output: 'export'`:
- ✅ **Works**: Fetch from `/public/mock/*.json` at runtime
- ✅ **Works**: Client-side fetch to external APIs (CORS must be configured)
- ❌ **Doesn't work**: Server-side API routes, Next.js rewrites, server actions
- ⚠️ **Workaround**: Use proxy service or preload data during build

### 5. Example: Loading from JSON

```typescript
// lib/data-loader.ts
export const loadMockData = async () => {
  const [routes, ports, risks] = await Promise.all([
    fetch('/mock/routes.json').then(r => r.json()),
    fetch('/mock/ports.json').then(r => r.json()),
    fetch('/mock/risks.json').then(r => r.json()),
  ])
  return { routes: routes.routes, ports: ports.ports, risks: risks.risks }
}
```

```typescript
// components/routes-table.tsx
const [routes, setRoutes] = useState<TradeRoute[]>([])

useEffect(() => {
  loadMockData().then(data => setRoutes(data.routes))
}, [])
```

**Important**: Data loading happens client-side only. No server-side generation is used, maintaining full Vercel static export compatibility.

## Performance

- Target: 60 FPS with ~50 trade flow arcs
- Lazy loading for heavy components
- Optimized SVG rendering
- Client-side data caching

## Accessibility

- ARIA labels on all interactive elements
- Keyboard navigation support
- Focus indicators
- Screen reader friendly

## License

MIT
