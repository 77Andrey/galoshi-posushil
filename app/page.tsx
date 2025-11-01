"use client"

import { useState, useRef } from "react"
import { WorldMap } from "@/components/world-map"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { tradeRoutes, riskMetrics } from "@/lib/mock-data"
import { AlertTriangle, TrendingUp, TrendingDown, Activity, Globe, Ship } from "lucide-react"
import { RiskOpportunitiesPanel } from "@/components/risk-opportunities-panel"
import { RoutesTable } from "@/components/routes-table"
import { ScenariosDialog } from "@/components/scenarios-dialog"
import { ExportDialog } from "@/components/export-dialog"
import { KeyboardShortcutsDialog } from "@/components/keyboard-shortcuts-dialog"
import { LanguageSelector } from "@/components/language-selector"
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts"
import { useLanguage } from "@/components/language-provider"
import { getTranslation } from "@/lib/i18n"

export default function DashboardPage() {
  const { language } = useLanguage()
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null)
  const [showShortcuts, setShowShortcuts] = useState(false)
  const scenariosButtonRef = useRef<HTMLButtonElement>(null)
  const exportButtonRef = useRef<HTMLButtonElement>(null)

  const selectedRouteData = selectedRoute ? tradeRoutes.find((r) => r.id === selectedRoute) : null

  useKeyboardShortcuts([
    {
      key: "?",
      callback: () => setShowShortcuts(true),
      description: "Show keyboard shortcuts",
    },
    {
      key: "s",
      callback: () => scenariosButtonRef.current?.click(),
      description: "Open scenarios",
    },
    {
      key: "e",
      callback: () => exportButtonRef.current?.click(),
      description: "Open export",
    },
    {
      key: "Escape",
      callback: () => setSelectedRoute(null),
      description: "Clear selection",
    },
  ])

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      {/* Header */}
      <header className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground text-balance">
              {getTranslation(language, 'title')}
            </h1>
            <p className="text-muted-foreground mt-1">
              {getTranslation(language, 'subtitle')}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSelector />
            <div ref={scenariosButtonRef as any}>
              <ScenariosDialog />
            </div>
            <div ref={exportButtonRef as any}>
              <ExportDialog />
            </div>
            <KeyboardShortcutsDialog />
          </div>
        </div>
      </header>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <Card className="glass-panel p-4">
          <div className="flex items-center gap-2 mb-2">
            <Ship className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground">{getTranslation(language, 'tradeVolume')}</span>
          </div>
          <div className="text-2xl font-bold text-foreground">${riskMetrics.globalTradeVolume}T</div>
        </Card>

        <Card className="glass-panel p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-destructive" />
            <span className="text-xs text-muted-foreground">{getTranslation(language, 'atRisk')}</span>
          </div>
          <div className="text-2xl font-bold text-destructive">{riskMetrics.routesAtRisk}</div>
        </Card>

        <Card className="glass-panel p-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-accent" />
            <span className="text-xs text-muted-foreground">{getTranslation(language, 'disruptions')}</span>
          </div>
          <div className="text-2xl font-bold text-accent">{riskMetrics.activeDisruptions}</div>
        </Card>

        <Card className="glass-panel p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-4 h-4 text-secondary" />
            <span className="text-xs text-muted-foreground">{getTranslation(language, 'avgDelay')}</span>
          </div>
          <div className="text-2xl font-bold text-foreground">{riskMetrics.averageDelayDays}d</div>
        </Card>

        <Card className="glass-panel p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-chart-2" />
            <span className="text-xs text-muted-foreground">{getTranslation(language, 'estLosses')}</span>
          </div>
          <div className="text-2xl font-bold text-foreground">${riskMetrics.estimatedLosses}B</div>
        </Card>

        <Card className="glass-panel p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-destructive" />
            <span className="text-xs text-muted-foreground">{getTranslation(language, 'criticalPoints')}</span>
          </div>
          <div className="text-2xl font-bold text-destructive">{riskMetrics.criticalChokepoints}</div>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Map Section */}
        <Card className="lg:col-span-2 glass-panel p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-foreground">{getTranslation(language, 'globalTradeRoutes')}</h2>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {getTranslation(language, 'liveData')}
              </Badge>
              <div className="w-2 h-2 rounded-full bg-chart-2 animate-pulse" />
            </div>
          </div>
          <div className="h-[500px] lg:h-[600px]">
            <WorldMap selectedRoute={selectedRoute} onRouteSelect={setSelectedRoute} />
          </div>
        </Card>

        {/* Route Details Panel */}
        <Card className="glass-panel p-4">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            {selectedRouteData ? getTranslation(language, 'routeDetails') : getTranslation(language, 'selectRoute')}
          </h2>

          {selectedRouteData ? (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-foreground text-balance">{selectedRouteData.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedRouteData.origin.country} → {selectedRouteData.destination.country}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{getTranslation(language, 'status')}</span>
                  <Badge variant={selectedRouteData.status === "active" ? "default" : "destructive"}>
                    {selectedRouteData.status}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{getTranslation(language, 'riskLevel')}</span>
                  <Badge
                    variant={
                      selectedRouteData.risk === "critical"
                        ? "destructive"
                        : selectedRouteData.risk === "high"
                          ? "destructive"
                          : selectedRouteData.risk === "medium"
                            ? "secondary"
                            : "default"
                    }
                  >
                    {selectedRouteData.risk}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{getTranslation(language, 'volume')}</span>
                  <span className="text-sm font-semibold text-foreground">${selectedRouteData.volume}B</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{getTranslation(language, 'commodity')}</span>
                  <span className="text-sm text-foreground">{selectedRouteData.commodity}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{getTranslation(language, 'alternatives')}</span>
                  <span className="text-sm text-foreground">{selectedRouteData.alternativeRoutes} routes</span>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-foreground mb-2">{getTranslation(language, 'chokepointsPassed')}</h4>
                <div className="space-y-1">
                  {selectedRouteData.chokepointsPassed.map((cp, idx) => (
                    <div key={idx} className="text-xs text-muted-foreground flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      {cp}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-foreground mb-2">{getTranslation(language, 'geopoliticalFactors')}</h4>
                <div className="space-y-1">
                  {selectedRouteData.geopoliticalFactors.map((factor, idx) => (
                    <div key={idx} className="text-xs text-muted-foreground flex items-center gap-2">
                      <AlertTriangle className="w-3 h-3 text-destructive" />
                      {factor}
                    </div>
                  ))}
                </div>
              </div>

              <Button className="w-full mt-4 bg-transparent" variant="outline">
                {getTranslation(language, 'viewFullAnalysis')}
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[400px] text-center">
              <Globe className="w-16 h-16 text-muted-foreground/30 mb-4" />
              <p className="text-sm text-muted-foreground">
                {getTranslation(language, 'clickToView')}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Press <kbd className="px-1.5 py-0.5 text-xs font-semibold bg-muted border border-border rounded">?</kbd>{" "}
                for keyboard shortcuts
              </p>
            </div>
          )}
        </Card>
      </div>

      <div className="mt-6">
        <RiskOpportunitiesPanel />
      </div>

      <div className="mt-6">
        <RoutesTable />
      </div>
    </div>
  )
}
