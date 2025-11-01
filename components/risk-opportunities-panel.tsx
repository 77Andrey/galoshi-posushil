"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { riskAlerts, opportunities, type RiskAlert, type Opportunity } from "@/lib/mock-data"
import { AlertTriangle, TrendingUp, Clock, Target, ChevronRight, Filter, ArrowUpRight } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { getTranslation } from "@/lib/i18n"

export function RiskOpportunitiesPanel() {
  const { language } = useLanguage()
  const [selectedTab, setSelectedTab] = useState<"risks" | "opportunities">("risks")
  const [severityFilter, setSeverityFilter] = useState<string>("all")
  
  const t = (key: keyof import('@/lib/i18n').Translations) => getTranslation(language, key)

  const filteredRisks =
    severityFilter === "all" ? riskAlerts : riskAlerts.filter((alert) => alert.severity === severityFilter)

  const getSeverityColor = (severity: RiskAlert["severity"]) => {
    switch (severity) {
      case "critical":
        return "text-destructive"
      case "high":
        return "text-orange-500"
      case "medium":
        return "text-yellow-500"
      case "low":
        return "text-chart-2"
    }
  }

  const getCategoryIcon = (category: RiskAlert["category"]) => {
    return <AlertTriangle className="w-4 h-4" />
  }

  const getTypeIcon = (type: Opportunity["type"]) => {
    return <TrendingUp className="w-4 h-4" />
  }

  return (
    <Card className="glass-panel p-4 h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-foreground">{t('intelligenceFeed')}</h2>
        <Button variant="ghost" size="sm">
          <Filter className="w-4 h-4" />
        </Button>
      </div>

      <Tabs value={selectedTab} onValueChange={(v) => setSelectedTab(v as "risks" | "opportunities")}>
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="risks" className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            {t('risks')} ({riskAlerts.length})
          </TabsTrigger>
          <TabsTrigger value="opportunities" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            {t('opportunities')} ({opportunities.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="risks" className="mt-0">
          {/* Severity Filter */}
          <div className="flex gap-2 mb-4 flex-wrap">
            <Button
              variant={severityFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSeverityFilter("all")}
            >
              All
            </Button>
            <Button
              variant={severityFilter === "critical" ? "default" : "outline"}
              size="sm"
              onClick={() => setSeverityFilter("critical")}
            >
              {t('critical')}
            </Button>
            <Button
              variant={severityFilter === "high" ? "default" : "outline"}
              size="sm"
              onClick={() => setSeverityFilter("high")}
            >
              {t('high')}
            </Button>
            <Button
              variant={severityFilter === "medium" ? "default" : "outline"}
              size="sm"
              onClick={() => setSeverityFilter("medium")}
            >
              {t('medium')}
            </Button>
          </div>

          <ScrollArea className="h-[500px] pr-4">
            <div className="space-y-3">
              {filteredRisks.map((alert) => (
                <Card
                  key={alert.id}
                  className="p-4 border-l-4 hover:bg-accent/5 transition-colors cursor-pointer"
                  style={{
                    borderLeftColor:
                      alert.severity === "critical"
                        ? "hsl(var(--destructive))"
                        : alert.severity === "high"
                          ? "rgb(249, 115, 22)"
                          : alert.severity === "medium"
                            ? "rgb(234, 179, 8)"
                            : "hsl(var(--chart-2))",
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={getSeverityColor(alert.severity)}>{getCategoryIcon(alert.category)}</div>
                      <h3 className="font-semibold text-sm text-foreground">{alert.title}</h3>
                    </div>
                    <Badge variant={alert.severity === "critical" ? "destructive" : "secondary"} className="text-xs">
                      {alert.severity}
                    </Badge>
                  </div>

                  <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{alert.description}</p>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Impact:</span>
                      <span className="text-foreground font-medium">{alert.impact}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Probability:</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: `${alert.probability}%` }} />
                        </div>
                        <span className="text-foreground font-medium">{alert.probability}%</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Timeframe:
                      </span>
                      <span className="text-foreground">{alert.timeframe}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Affected Routes:</span>
                      <span className="text-foreground">{alert.affectedRoutes.length}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                    <span className="text-xs text-muted-foreground">
                      Updated {alert.lastUpdated.toLocaleDateString()}
                    </span>
                    <Button variant="ghost" size="sm" className="h-7 text-xs">
                      Details
                      <ChevronRight className="w-3 h-3 ml-1" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="opportunities" className="mt-0">
          <ScrollArea className="h-[580px] pr-4">
            <div className="space-y-3">
              {opportunities.map((opp) => (
                <Card
                  key={opp.id}
                  className="p-4 border-l-4 border-l-chart-2 hover:bg-accent/5 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="text-chart-2">{getTypeIcon(opp.type)}</div>
                      <h3 className="font-semibold text-sm text-foreground">{opp.title}</h3>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {opp.type.replace("-", " ")}
                    </Badge>
                  </div>

                  <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{opp.description}</p>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Potential Value:</span>
                      <span className="text-chart-2 font-semibold flex items-center gap-1">
                        <ArrowUpRight className="w-3 h-3" />${opp.potentialValue}B
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Confidence:</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-chart-2 rounded-full" style={{ width: `${opp.confidence}%` }} />
                        </div>
                        <span className="text-foreground font-medium">{opp.confidence}%</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Target className="w-3 h-3" />
                        Time to Realize:
                      </span>
                      <span className="text-foreground">{opp.timeToRealize}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Related Routes:</span>
                      <span className="text-foreground">{opp.relatedRoutes.length}</span>
                    </div>
                  </div>

                  <Button variant="ghost" size="sm" className="w-full mt-3 h-7 text-xs">
                    Explore Opportunity
                    <ChevronRight className="w-3 h-3 ml-1" />
                  </Button>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </Card>
  )
}
