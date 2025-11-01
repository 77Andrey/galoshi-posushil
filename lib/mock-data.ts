export interface TradeRoute {
  id: string
  name: string
  origin: { lat: number; lng: number; country: string }
  destination: { lat: number; lng: number; country: string }
  volume: number // in billions USD
  commodity: string
  risk: "low" | "medium" | "high" | "critical"
  status: "active" | "disrupted" | "at-risk"
  chokepointsPassed: string[]
  alternativeRoutes: number
  geopoliticalFactors: string[]
}

export interface Chokepoint {
  id: string
  name: string
  lat: number
  lng: number
  type: "strait" | "canal" | "port"
  riskLevel: "low" | "medium" | "high" | "critical"
  throughput: number // percentage of global trade
  recentIncidents: number
  controllingNation: string
}

export const tradeRoutes: TradeRoute[] = [
  {
    id: "route-1",
    name: "Asia-Europe Container Route",
    origin: { lat: 1.3521, lng: 103.8198, country: "Singapore" },
    destination: { lat: 51.5074, lng: -0.1278, country: "United Kingdom" },
    volume: 450,
    commodity: "Electronics & Manufactured Goods",
    risk: "high",
    status: "at-risk",
    chokepointsPassed: ["Strait of Malacca", "Suez Canal", "Strait of Gibraltar"],
    alternativeRoutes: 2,
    geopoliticalFactors: ["Red Sea tensions", "Suez Canal congestion", "Piracy risks"],
  },
  {
    id: "route-2",
    name: "Middle East Oil Route",
    origin: { lat: 26.2235, lng: 50.5876, country: "Bahrain" },
    destination: { lat: 35.6762, lng: 139.6503, country: "Japan" },
    volume: 380,
    commodity: "Crude Oil & Petroleum",
    risk: "critical",
    status: "disrupted",
    chokepointsPassed: ["Strait of Hormuz", "Strait of Malacca"],
    alternativeRoutes: 1,
    geopoliticalFactors: ["Iran tensions", "Regional conflicts", "OPEC policies"],
  },
  {
    id: "route-3",
    name: "Trans-Pacific Trade Lane",
    origin: { lat: 31.2304, lng: 121.4737, country: "China" },
    destination: { lat: 34.0522, lng: -118.2437, country: "United States" },
    volume: 620,
    commodity: "Consumer Goods & Technology",
    risk: "medium",
    status: "active",
    chokepointsPassed: ["South China Sea"],
    alternativeRoutes: 3,
    geopoliticalFactors: ["US-China relations", "Taiwan Strait tensions", "Trade tariffs"],
  },
  {
    id: "route-4",
    name: "Baltic-North Sea Route",
    origin: { lat: 59.9139, lng: 10.7522, country: "Norway" },
    destination: { lat: 52.52, lng: 13.405, country: "Germany" },
    volume: 180,
    commodity: "Natural Gas & Energy",
    risk: "high",
    status: "at-risk",
    chokepointsPassed: ["Danish Straits"],
    alternativeRoutes: 2,
    geopoliticalFactors: ["Russia-Ukraine conflict", "Energy security", "Pipeline politics"],
  },
  {
    id: "route-5",
    name: "South America-Asia Route",
    origin: { lat: -23.5505, lng: -46.6333, country: "Brazil" },
    destination: { lat: 31.2304, lng: 121.4737, country: "China" },
    volume: 290,
    commodity: "Agricultural Products & Minerals",
    risk: "low",
    status: "active",
    chokepointsPassed: ["Panama Canal"],
    alternativeRoutes: 2,
    geopoliticalFactors: ["Panama Canal capacity", "Climate impacts", "BRICS cooperation"],
  },
  {
    id: "route-6",
    name: "Arctic Northern Route",
    origin: { lat: 59.3293, lng: 18.0686, country: "Sweden" },
    destination: { lat: 43.1332, lng: 131.9113, country: "Russia" },
    volume: 85,
    commodity: "LNG & Raw Materials",
    risk: "medium",
    status: "active",
    chokepointsPassed: ["Bering Strait"],
    alternativeRoutes: 1,
    geopoliticalFactors: ["Arctic sovereignty", "Climate change", "Russia sanctions"],
  },
]

export const chokepoints: Chokepoint[] = [
  {
    id: "cp-1",
    name: "Strait of Hormuz",
    lat: 26.5667,
    lng: 56.25,
    type: "strait",
    riskLevel: "critical",
    throughput: 21,
    recentIncidents: 8,
    controllingNation: "Iran/Oman",
  },
  {
    id: "cp-2",
    name: "Strait of Malacca",
    lat: 1.43,
    lng: 102.89,
    type: "strait",
    riskLevel: "high",
    throughput: 25,
    recentIncidents: 3,
    controllingNation: "Malaysia/Singapore/Indonesia",
  },
  {
    id: "cp-3",
    name: "Suez Canal",
    lat: 30.5852,
    lng: 32.3498,
    type: "canal",
    riskLevel: "high",
    throughput: 12,
    recentIncidents: 5,
    controllingNation: "Egypt",
  },
  {
    id: "cp-4",
    name: "Panama Canal",
    lat: 9.08,
    lng: -79.68,
    type: "canal",
    riskLevel: "medium",
    throughput: 6,
    recentIncidents: 1,
    controllingNation: "Panama",
  },
  {
    id: "cp-5",
    name: "Bab el-Mandeb Strait",
    lat: 12.5833,
    lng: 43.3333,
    type: "strait",
    riskLevel: "critical",
    throughput: 8,
    recentIncidents: 12,
    controllingNation: "Yemen/Djibouti",
  },
  {
    id: "cp-6",
    name: "South China Sea",
    lat: 12.0,
    lng: 113.0,
    type: "strait",
    riskLevel: "high",
    throughput: 30,
    recentIncidents: 6,
    controllingNation: "Disputed",
  },
]

export const riskMetrics = {
  globalTradeVolume: 28.5, // trillion USD
  routesAtRisk: 42,
  activeDisruptions: 7,
  criticalChokepoints: 3,
  averageDelayDays: 4.2,
  estimatedLosses: 125, // billion USD
}

export interface RiskAlert {
  id: string
  title: string
  severity: "critical" | "high" | "medium" | "low"
  category: "geopolitical" | "environmental" | "economic" | "infrastructure"
  affectedRoutes: string[]
  impact: string
  probability: number // 0-100
  timeframe: string
  description: string
  lastUpdated: Date
}

export interface Opportunity {
  id: string
  title: string
  type: "new-route" | "infrastructure" | "trade-agreement" | "technology"
  potentialValue: number // in billions USD
  timeToRealize: string
  confidence: number // 0-100
  description: string
  relatedRoutes: string[]
}

export const riskAlerts: RiskAlert[] = [
  {
    id: "alert-1",
    title: "Red Sea Escalation",
    severity: "critical",
    category: "geopolitical",
    affectedRoutes: ["route-1"],
    impact: "Major delays and rerouting via Cape of Good Hope",
    probability: 85,
    timeframe: "Ongoing",
    description:
      "Continued attacks on commercial vessels in the Red Sea forcing carriers to avoid Suez Canal route. Average delay increased to 14 days.",
    lastUpdated: new Date("2025-01-28"),
  },
  {
    id: "alert-2",
    title: "Strait of Hormuz Tensions",
    severity: "critical",
    category: "geopolitical",
    affectedRoutes: ["route-2"],
    impact: "21% of global oil supply at risk",
    probability: 72,
    timeframe: "1-3 months",
    description: "Heightened military activity and diplomatic tensions threaten closure of critical oil transit point.",
    lastUpdated: new Date("2025-01-27"),
  },
  {
    id: "alert-3",
    title: "Panama Canal Water Shortage",
    severity: "high",
    category: "environmental",
    affectedRoutes: ["route-5"],
    impact: "Reduced daily transits by 40%",
    probability: 90,
    timeframe: "Next 6 months",
    description:
      "Severe drought conditions limiting canal capacity. Ships facing 2-3 week delays or forced to use alternative routes.",
    lastUpdated: new Date("2025-01-26"),
  },
  {
    id: "alert-4",
    title: "South China Sea Disputes",
    severity: "high",
    category: "geopolitical",
    affectedRoutes: ["route-3"],
    impact: "Increased insurance costs and route uncertainty",
    probability: 65,
    timeframe: "Ongoing",
    description:
      "Territorial disputes and military exercises creating navigation challenges for 30% of global maritime trade.",
    lastUpdated: new Date("2025-01-25"),
  },
  {
    id: "alert-5",
    title: "Baltic Pipeline Vulnerability",
    severity: "medium",
    category: "infrastructure",
    affectedRoutes: ["route-4"],
    impact: "Energy supply disruption risk",
    probability: 55,
    timeframe: "3-6 months",
    description:
      "Aging infrastructure and geopolitical tensions increase risk of energy supply interruptions to Northern Europe.",
    lastUpdated: new Date("2025-01-24"),
  },
]

export const opportunities: Opportunity[] = [
  {
    id: "opp-1",
    title: "Arctic Northern Sea Route Expansion",
    type: "new-route",
    potentialValue: 85,
    timeToRealize: "2-5 years",
    confidence: 70,
    description: "Climate change opening new shipping lanes through Arctic, reducing Asia-Europe transit time by 40%.",
    relatedRoutes: ["route-6"],
  },
  {
    id: "opp-2",
    title: "India-Middle East-Europe Corridor",
    type: "infrastructure",
    potentialValue: 120,
    timeToRealize: "5-10 years",
    confidence: 65,
    description:
      "New multimodal trade corridor bypassing traditional chokepoints, connecting India to Europe via Middle East.",
    relatedRoutes: ["route-1", "route-2"],
  },
  {
    id: "opp-3",
    title: "Belt and Road Alternative Routes",
    type: "infrastructure",
    potentialValue: 200,
    timeToRealize: "3-7 years",
    confidence: 75,
    description: "Development of overland rail corridors reducing dependence on maritime chokepoints.",
    relatedRoutes: ["route-1", "route-3"],
  },
  {
    id: "opp-4",
    title: "Autonomous Shipping Technology",
    type: "technology",
    potentialValue: 150,
    timeToRealize: "5-10 years",
    confidence: 60,
    description: "AI-powered autonomous vessels reducing crew costs by 30% and improving route optimization.",
    relatedRoutes: ["route-1", "route-3", "route-5"],
  },
  {
    id: "opp-5",
    title: "Regional Trade Agreements",
    type: "trade-agreement",
    potentialValue: 95,
    timeToRealize: "1-3 years",
    confidence: 80,
    description: "New bilateral and regional trade agreements reducing tariffs and streamlining customs procedures.",
    relatedRoutes: ["route-3", "route-5"],
  },
]

export interface Scenario {
  id: string
  name: string
  description: string
  category: "conflict" | "climate" | "economic" | "infrastructure"
  probability: number
  impact: {
    affectedRoutes: string[]
    affectedChokepoints: string[]
    volumeChange: number // percentage change
    delayIncrease: number // days
    costIncrease: number // percentage
  }
  timeline: string
  mitigationStrategies: string[]
}

export const scenarios: Scenario[] = [
  {
    id: "scenario-1",
    name: "Strait of Hormuz Closure",
    description:
      "Complete closure of the Strait of Hormuz due to military conflict, blocking 21% of global oil supply.",
    category: "conflict",
    probability: 15,
    impact: {
      affectedRoutes: ["route-2"],
      affectedChokepoints: ["cp-1"],
      volumeChange: -85,
      delayIncrease: 21,
      costIncrease: 150,
    },
    timeline: "1-3 months",
    mitigationStrategies: [
      "Activate strategic petroleum reserves",
      "Reroute via Cape of Good Hope",
      "Increase pipeline capacity from alternative sources",
      "Negotiate diplomatic resolution",
    ],
  },
  {
    id: "scenario-2",
    name: "Red Sea Escalation",
    description:
      "Sustained attacks on commercial vessels in the Red Sea forcing all traffic to avoid Suez Canal route.",
    category: "conflict",
    probability: 45,
    impact: {
      affectedRoutes: ["route-1"],
      affectedChokepoints: ["cp-3", "cp-5"],
      volumeChange: -60,
      delayIncrease: 14,
      costIncrease: 45,
    },
    timeline: "Ongoing - 6 months",
    mitigationStrategies: [
      "Reroute via Cape of Good Hope",
      "Increase naval protection",
      "Use alternative land corridors",
      "Negotiate ceasefire agreements",
    ],
  },
  {
    id: "scenario-3",
    name: "Panama Canal Drought Crisis",
    description: "Severe drought reduces Panama Canal capacity by 60%, causing massive delays for trans-Pacific trade.",
    category: "climate",
    probability: 70,
    impact: {
      affectedRoutes: ["route-5"],
      affectedChokepoints: ["cp-4"],
      volumeChange: -55,
      delayIncrease: 18,
      costIncrease: 35,
    },
    timeline: "6-12 months",
    mitigationStrategies: [
      "Reroute via Strait of Magellan",
      "Invest in water management systems",
      "Use alternative Pacific routes",
      "Implement vessel size restrictions",
    ],
  },
  {
    id: "scenario-4",
    name: "South China Sea Conflict",
    description: "Military tensions escalate into armed conflict, disrupting 30% of global maritime trade.",
    category: "conflict",
    probability: 25,
    impact: {
      affectedRoutes: ["route-3"],
      affectedChokepoints: ["cp-6"],
      volumeChange: -75,
      delayIncrease: 25,
      costIncrease: 120,
    },
    timeline: "3-12 months",
    mitigationStrategies: [
      "Reroute through Indonesian straits",
      "Increase air freight capacity",
      "Develop overland rail alternatives",
      "Pursue diplomatic de-escalation",
    ],
  },
  {
    id: "scenario-5",
    name: "Arctic Route Opening",
    description: "Accelerated ice melt opens Northern Sea Route year-round, reducing Asia-Europe transit time by 40%.",
    category: "climate",
    probability: 60,
    impact: {
      affectedRoutes: ["route-6", "route-1"],
      affectedChokepoints: [],
      volumeChange: 85,
      delayIncrease: -12,
      costIncrease: -25,
    },
    timeline: "2-5 years",
    mitigationStrategies: [
      "Invest in ice-capable vessels",
      "Develop Arctic port infrastructure",
      "Establish international navigation agreements",
      "Build search and rescue capabilities",
    ],
  },
  {
    id: "scenario-6",
    name: "Global Trade War",
    description: "Major economies impose reciprocal tariffs, disrupting established trade patterns and supply chains.",
    category: "economic",
    probability: 40,
    impact: {
      affectedRoutes: ["route-3", "route-1", "route-5"],
      affectedChokepoints: [],
      volumeChange: -35,
      delayIncrease: 8,
      costIncrease: 65,
    },
    timeline: "1-3 years",
    mitigationStrategies: [
      "Diversify supply chains",
      "Establish regional trade agreements",
      "Relocate manufacturing closer to markets",
      "Negotiate bilateral trade deals",
    ],
  },
  {
    id: "scenario-7",
    name: "Suez Canal Blockage",
    description: "Major vessel grounding blocks Suez Canal for extended period, similar to 2021 Ever Given incident.",
    category: "infrastructure",
    probability: 35,
    impact: {
      affectedRoutes: ["route-1"],
      affectedChokepoints: ["cp-3"],
      volumeChange: -70,
      delayIncrease: 10,
      costIncrease: 55,
    },
    timeline: "1-2 weeks",
    mitigationStrategies: [
      "Immediate rerouting via Cape of Good Hope",
      "Deploy specialized salvage equipment",
      "Implement enhanced traffic management",
      "Increase canal width and depth",
    ],
  },
]
