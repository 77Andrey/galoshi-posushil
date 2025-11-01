# Trade Superhighways: Global Trade Intel

Advanced analytics SPA for global trade intelligence with holographic glass UI aesthetic.

## Features

- **Geo-Intelligence Map**: SVG-based world map with animated trade flow arcs
- **Risk & Opportunities Panel**: Real-time risk scoring and anomaly detection
- **Routes Analysis**: Comprehensive trade corridor data with filtering
- **Scenario Planning**: "What-if" analysis for tariffs, disruptions, and currency changes
- **Export Insights**: Generate markdown reports of current analysis

## Tech Stack

- **Next.js 16** (App Router) with static export
- **TypeScript** for type safety
- **Tailwind CSS v4** for styling
- **shadcn/ui** components
- **react-simple-maps** for SVG-based mapping (no external API keys required)

## Vercel-Safe Architecture

This application is designed for seamless Vercel deployment with **zero configuration**:

### Static Export
- Configured with `output: 'export'` in next.config.mjs
- No server-side routes or server actions
- All data is client-side or loaded from static JSON files

### No External Dependencies
- **No Mapbox tokens required**: Uses react-simple-maps with SVG rendering
- **No WebGL requirements**: All visualizations work in SSR and static export
- **No API keys needed**: All data is synthetic and loaded from /public/mock

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
