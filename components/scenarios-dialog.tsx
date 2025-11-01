"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { scenarios, type Scenario } from "@/lib/mock-data"
import { useLanguage } from "@/components/language-provider"
import { getTranslation } from "@/lib/i18n"
import {
  Globe,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Clock,
  DollarSign,
  Shield,
  Flame,
  CloudRain,
  BarChart3,
  Wrench,
  Calculator,
} from "lucide-react"

export function ScenariosDialog() {
  const { language } = useLanguage()
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null)
  const [activeScenarios, setActiveScenarios] = useState<string[]>([])
  
  const t = (key: keyof import('@/lib/i18n').Translations) => getTranslation(language, key)

  const getCategoryIcon = (category: Scenario["category"]) => {
    switch (category) {
      case "conflict":
        return <Flame className="w-4 h-4" />
      case "climate":
        return <CloudRain className="w-4 h-4" />
      case "economic":
        return <BarChart3 className="w-4 h-4" />
      case "infrastructure":
        return <Wrench className="w-4 h-4" />
    }
  }

  const getCategoryColor = (category: Scenario["category"]) => {
    switch (category) {
      case "conflict":
        return "text-destructive"
      case "climate":
        return "text-blue-500"
      case "economic":
        return "text-yellow-500"
      case "infrastructure":
        return "text-purple-500"
    }
  }

  const toggleScenario = (scenarioId: string) => {
    setActiveScenarios((prev) =>
      prev.includes(scenarioId) ? prev.filter((id) => id !== scenarioId) : [...prev, scenarioId],
    )
  }

  const scenariosByCategory = {
    conflict: scenarios.filter((s) => s.category === "conflict"),
    climate: scenarios.filter((s) => s.category === "climate"),
    economic: scenarios.filter((s) => s.category === "economic"),
    infrastructure: scenarios.filter((s) => s.category === "infrastructure"),
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Globe className="w-4 h-4 mr-2" />
          {t('scenarios')}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="text-2xl">{t('scenarioPlanning')}</DialogTitle>
          <DialogDescription>
            {t('simulateScenarios')}
          </DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6 px-6 pb-6">
          {/* Scenarios List */}
          <div>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-5 mb-4">
                <TabsTrigger value="all" className="text-xs">
                  All
                </TabsTrigger>
                <TabsTrigger value="conflict" className="text-xs">
                  <Flame className="w-3 h-3" />
                </TabsTrigger>
                <TabsTrigger value="climate" className="text-xs">
                  <CloudRain className="w-3 h-3" />
                </TabsTrigger>
                <TabsTrigger value="economic" className="text-xs">
                  <BarChart3 className="w-3 h-3" />
                </TabsTrigger>
                <TabsTrigger value="infrastructure" className="text-xs">
                  <Wrench className="w-3 h-3" />
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-0">
                <ScrollArea className="h-[500px] pr-4">
                  <div className="space-y-3">
                    {scenarios.map((scenario) => (
                      <Card
                        key={scenario.id}
                        className={`p-4 cursor-pointer transition-all hover:bg-accent/5 ${
                          selectedScenario?.id === scenario.id ? "ring-2 ring-primary" : ""
                        } ${activeScenarios.includes(scenario.id) ? "bg-accent/10" : ""}`}
                        onClick={() => setSelectedScenario(scenario)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className={getCategoryColor(scenario.category)}>
                              {getCategoryIcon(scenario.category)}
                            </div>
                            <h3 className="font-semibold text-sm text-foreground">{scenario.name}</h3>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {scenario.probability}%
                          </Badge>
                        </div>

                        <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{scenario.description}</p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 text-xs">
                            <span className={scenario.impact.volumeChange < 0 ? "text-destructive" : "text-chart-2"}>
                              {scenario.impact.volumeChange > 0 ? "+" : ""}
                              {scenario.impact.volumeChange}% volume
                            </span>
                            <span className="text-muted-foreground">
                              {scenario.impact.affectedRoutes.length} routes
                            </span>
                          </div>
                          <Button
                            size="sm"
                            variant={activeScenarios.includes(scenario.id) ? "default" : "outline"}
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleScenario(scenario.id)
                            }}
                            className="h-7 text-xs"
                          >
                            {activeScenarios.includes(scenario.id) ? t('active') : t('activate')}
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>

              {Object.entries(scenariosByCategory).map(([category, categoryScenarios]) => (
                <TabsContent key={category} value={category} className="mt-0">
                  <ScrollArea className="h-[500px] pr-4">
                    <div className="space-y-3">
                      {categoryScenarios.map((scenario) => (
                        <Card
                          key={scenario.id}
                          className={`p-4 cursor-pointer transition-all hover:bg-accent/5 ${
                            selectedScenario?.id === scenario.id ? "ring-2 ring-primary" : ""
                          } ${activeScenarios.includes(scenario.id) ? "bg-accent/10" : ""}`}
                          onClick={() => setSelectedScenario(scenario)}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold text-sm text-foreground">{scenario.name}</h3>
                            <Badge variant="outline" className="text-xs">
                              {scenario.probability}%
                            </Badge>
                          </div>

                          <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{scenario.description}</p>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 text-xs">
                              <span className={scenario.impact.volumeChange < 0 ? "text-destructive" : "text-chart-2"}>
                                {scenario.impact.volumeChange > 0 ? "+" : ""}
                                {scenario.impact.volumeChange}% volume
                              </span>
                              <span className="text-muted-foreground">
                                {scenario.impact.affectedRoutes.length} routes
                              </span>
                            </div>
                            <Button
                              size="sm"
                              variant={activeScenarios.includes(scenario.id) ? "default" : "outline"}
                              onClick={(e) => {
                                e.stopPropagation()
                                toggleScenario(scenario.id)
                              }}
                              className="h-7 text-xs"
                            >
                              {activeScenarios.includes(scenario.id) ? t('active') : t('activate')}
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>
              ))}
            </Tabs>
          </div>

          {/* Scenario Details */}
          <div>
            {selectedScenario ? (
              <Card className="p-4 h-[580px] overflow-auto">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className={getCategoryColor(selectedScenario.category)}>
                        {getCategoryIcon(selectedScenario.category)}
                      </div>
                      <h3 className="font-semibold text-lg text-foreground">{selectedScenario.name}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{selectedScenario.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Card className="p-3 bg-muted/30">
                      <div className="text-xs text-muted-foreground mb-1">{t('probability')}</div>
                      <div className="text-xl font-bold text-foreground">{selectedScenario.probability}%</div>
                    </Card>
                    <Card className="p-3 bg-muted/30">
                      <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {t('timeline')}
                      </div>
                      <div className="text-sm font-semibold text-foreground">{selectedScenario.timeline}</div>
                    </Card>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-destructive" />
                      {t('impactAnalysis')}
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                        <span className="text-sm text-muted-foreground">{t('volumeChange')}</span>
                        <span
                          className={`text-sm font-semibold flex items-center gap-1 ${
                            selectedScenario.impact.volumeChange < 0 ? "text-destructive" : "text-chart-2"
                          }`}
                        >
                          {selectedScenario.impact.volumeChange < 0 ? (
                            <TrendingDown className="w-4 h-4" />
                          ) : (
                            <TrendingUp className="w-4 h-4" />
                          )}
                          {selectedScenario.impact.volumeChange > 0 ? "+" : ""}
                          {selectedScenario.impact.volumeChange}%
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                        <span className="text-sm text-muted-foreground">{t('delayIncrease')}</span>
                        <span className="text-sm font-semibold text-foreground">
                          {selectedScenario.impact.delayIncrease > 0 ? "+" : ""}
                          {selectedScenario.impact.delayIncrease} days
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          {t('costImpact')}
                        </span>
                        <span
                          className={`text-sm font-semibold ${
                            selectedScenario.impact.costIncrease < 0 ? "text-chart-2" : "text-destructive"
                          }`}
                        >
                          {selectedScenario.impact.costIncrease > 0 ? "+" : ""}
                          {selectedScenario.impact.costIncrease}%
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                        <span className="text-sm text-muted-foreground">{t('affectedRoutes')}</span>
                        <span className="text-sm font-semibold text-foreground">
                          {selectedScenario.impact.affectedRoutes.length}
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                        <span className="text-sm text-muted-foreground">{t('affectedChokepoints')}</span>
                        <span className="text-sm font-semibold text-foreground">
                          {selectedScenario.impact.affectedChokepoints.length}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                      <Shield className="w-4 h-4 text-chart-2" />
                      {t('mitigationStrategies')}
                    </h4>
                    <div className="space-y-2">
                      {selectedScenario.mitigationStrategies.map((strategy, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-chart-2 mt-1.5 flex-shrink-0" />
                          <span className="text-muted-foreground leading-relaxed">{strategy}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Calculation Formulas */}
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                      <Calculator className="w-4 h-4 text-primary" />
                      {t('calculationFormulas')}
                    </h4>
                    <Card className="p-3 bg-muted/30 space-y-2">
                      <div className="space-y-1">
                        <div className="text-xs font-semibold text-foreground">{t('volumeAdjustment')}:</div>
                        <div className="text-xs text-muted-foreground font-mono">
                          New Volume = Base Volume × (1 + {selectedScenario.impact.volumeChange} / 100)
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Formula adjusts trade volume based on route availability and demand shifts
                        </div>
                      </div>
                      
                      <div className="space-y-1 pt-2 border-t border-border">
                        <div className="text-xs font-semibold text-foreground">{t('deliveryTimeImpact')}:</div>
                        <div className="text-xs text-muted-foreground font-mono">
                          New Transit Time = Base Transit Time + {selectedScenario.impact.delayIncrease} days
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Reflects rerouting delays, port congestion, and infrastructure constraints
                        </div>
                      </div>
                      
                      <div className="space-y-1 pt-2 border-t border-border">
                        <div className="text-xs font-semibold text-foreground">{t('costMultiplier')}:</div>
                        <div className="text-xs text-muted-foreground font-mono">
                          New Cost = Base Cost × (1 + {selectedScenario.impact.costIncrease} / 100)
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Includes fuel surcharges, insurance premiums, and tariff adjustments
                        </div>
                      </div>
                      
                      {selectedScenario.category === "economic" && (
                        <div className="space-y-1 pt-2 border-t border-border">
                          <div className="text-xs font-semibold text-foreground">{t('currencyImpact')}:</div>
                          <div className="text-xs text-muted-foreground font-mono">
                            Effective Cost = (Base Cost × FX Rate) + Tariff Changes
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            Accounts for exchange rate volatility and trade policy shifts
                          </div>
                        </div>
                      )}
                      
                      {selectedScenario.category === "conflict" && (
                        <div className="space-y-1 pt-2 border-t border-border">
                          <div className="text-xs font-semibold text-foreground">{t('riskPremium')}:</div>
                          <div className="text-xs text-muted-foreground font-mono">
                            Insurance Cost = Base Premium + (Risk Score × 15%)
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            Maritime insurance adjusts based on geopolitical risk assessment
                          </div>
                        </div>
                      )}
                    </Card>
                  </div>

                  <Button
                    className="w-full"
                    variant={activeScenarios.includes(selectedScenario.id) ? "destructive" : "default"}
                    onClick={() => toggleScenario(selectedScenario.id)}
                  >
                    {activeScenarios.includes(selectedScenario.id) ? t('deactivateScenario') : t('activateScenario')}
                  </Button>
                </div>
              </Card>
            ) : (
              <Card className="p-4 h-[580px] flex flex-col items-center justify-center text-center">
                <Globe className="w-16 h-16 text-muted-foreground/30 mb-4" />
                <h3 className="font-semibold text-foreground mb-2">{t('selectScenario')}</h3>
                <p className="text-sm text-muted-foreground max-w-xs">
                  {t('chooseScenario')}
                </p>
              </Card>
            )}
          </div>
        </div>

        {/* Active Scenarios Summary */}
        {activeScenarios.length > 0 && (
          <div className="px-6 pb-6 pt-2 border-t border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-destructive" />
                <span className="text-sm font-semibold text-foreground">
                  {activeScenarios.length} {t('activeScenarios')}
                </span>
              </div>
              <Button variant="outline" size="sm" onClick={() => setActiveScenarios([])}>
                {t('clearAll')}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
