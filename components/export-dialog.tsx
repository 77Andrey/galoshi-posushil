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
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { tradeRoutes, chokepoints, riskAlerts, opportunities, scenarios } from "@/lib/mock-data"
import { Download, FileJson, FileSpreadsheet, FileText, Check, FileCode } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { getTranslation } from "@/lib/i18n"

type ExportFormat = "json" | "csv" | "markdown"

export function ExportDialog() {
  const { language } = useLanguage()
  const [format, setFormat] = useState<ExportFormat>("markdown")
  const [includeRoutes, setIncludeRoutes] = useState(true)
  const [includeChokepoints, setIncludeChokepoints] = useState(true)
  const [includeRisks, setIncludeRisks] = useState(true)
  const [includeOpportunities, setIncludeOpportunities] = useState(true)
  const [includeScenarios, setIncludeScenarios] = useState(false)
  const [exported, setExported] = useState(false)
  
  const t = (key: keyof import('@/lib/i18n').Translations) => getTranslation(language, key)

  const handleExport = () => {
    const data: any = {}

    if (includeRoutes) data.routes = tradeRoutes
    if (includeChokepoints) data.chokepoints = chokepoints
    if (includeRisks) data.risks = riskAlerts
    if (includeOpportunities) data.opportunities = opportunities
    if (includeScenarios) data.scenarios = scenarios

    let content = ""
    let filename = ""
    let mimeType = ""

    switch (format) {
      case "json":
        content = JSON.stringify(data, null, 2)
        filename = "trade-intelligence-export.json"
        mimeType = "application/json"
        break

      case "csv":
        // Convert to CSV (simplified - just routes for demo)
        if (includeRoutes) {
          const headers = ["Name", "Origin", "Destination", "Volume", "Risk", "Status", "Commodity"]
          const rows = tradeRoutes.map((r) => [
            r.name,
            r.origin.country,
            r.destination.country,
            r.volume,
            r.risk,
            r.status,
            r.commodity,
          ])
          content = [headers, ...rows].map((row) => row.join(",")).join("\n")
        }
        filename = "trade-routes-export.csv"
        mimeType = "text/csv"
        break

      case "markdown":
        content = generateMarkdownReport(data)
        filename = "global-trade-intel-report.md"
        mimeType = "text/markdown"
        break
    }

    // Create download
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    setExported(true)
    setTimeout(() => setExported(false), 2000)
  }
  
  const generateMarkdownReport = (data: any): string => {
    const timestamp = new Date().toISOString().split('T')[0]
    let md = `# Global Trade Intelligence Report\n\n`
    md += `Generated: ${timestamp}\n\n`
    md += `---\n\n`
    
    // Executive Summary
    md += `## Executive Summary\n\n`
    md += `### Key Performance Indicators\n\n`
    md += `- **Total Trade Volume**: ${tradeRoutes.reduce((sum, r) => sum + r.volume, 0)} Billion USD\n`
    md += `- **Active Routes**: ${tradeRoutes.filter((r) => r.status === "active").length}\n`
    md += `- **At Risk Routes**: ${tradeRoutes.filter((r) => r.status === "at-risk").length}\n`
    md += `- **Critical Chokepoints**: ${chokepoints.filter((cp) => cp.riskLevel === "critical").length}\n`
    md += `- **Active Disruptions**: ${tradeRoutes.filter((r) => r.status === "disrupted").length}\n\n`
    md += `---\n\n`
    
    // Trade Routes
    if (includeRoutes && data.routes) {
      md += `## Trade Routes\n\n`
      md += `Total: ${data.routes.length} routes\n\n`
      
      data.routes.forEach((route: any) => {
        md += `### ${route.name}\n\n`
        md += `- **Origin**: ${route.origin.country} (${route.origin.lat}, ${route.origin.lng})\n`
        md += `- **Destination**: ${route.destination.country} (${route.destination.lat}, ${route.destination.lng})\n`
        md += `- **Volume**: $${route.volume}B\n`
        md += `- **Commodity**: ${route.commodity}\n`
        md += `- **Risk Level**: ${route.risk.toUpperCase()}\n`
        md += `- **Status**: ${route.status}\n`
        md += `- **Alternative Routes**: ${route.alternativeRoutes}\n`
        md += `- **Chokepoints**: ${route.chokepointsPassed.join(", ")}\n`
        md += `- **Geopolitical Factors**: ${route.geopoliticalFactors.join("; ")}\n\n`
      })
      md += `---\n\n`
    }
    
    // Chokepoints
    if (includeChokepoints && data.chokepoints) {
      md += `## Critical Chokepoints\n\n`
      md += `Total: ${data.chokepoints.length} chokepoints\n\n`
      
      data.chokepoints.forEach((point: any) => {
        md += `### ${point.name}\n\n`
        md += `- **Type**: ${point.type}\n`
        md += `- **Risk Level**: ${point.riskLevel.toUpperCase()}\n`
        md += `- **Throughput**: ${point.throughput}% of global trade\n`
        md += `- **Recent Incidents**: ${point.recentIncidents}\n`
        md += `- **Controlling Nation**: ${point.controllingNation}\n`
        md += `- **Location**: ${point.lat}, ${point.lng}\n\n`
      })
      md += `---\n\n`
    }
    
    // Risk Alerts
    if (includeRisks && data.risks) {
      md += `## Risk Alerts\n\n`
      md += `Total: ${data.risks.length} active risks\n\n`
      
      data.risks.forEach((risk: any) => {
        md += `### ${risk.title}\n\n`
        md += `**Severity**: ${risk.severity.toUpperCase()} | **Probability**: ${risk.probability}%\n\n`
        md += `${risk.description}\n\n`
        md += `- **Impact**: ${risk.impact}\n`
        md += `- **Timeframe**: ${risk.timeframe}\n`
        md += `- **Category**: ${risk.category}\n`
        md += `- **Affected Routes**: ${risk.affectedRoutes.length}\n\n`
      })
      md += `---\n\n`
    }
    
    // Opportunities
    if (includeOpportunities && data.opportunities) {
      md += `## Strategic Opportunities\n\n`
      md += `Total: ${data.opportunities.length} opportunities\n\n`
      
      data.opportunities.forEach((opp: any) => {
        md += `### ${opp.title}\n\n`
        md += `**Type**: ${opp.type.replace("-", " ").toUpperCase()} | **Confidence**: ${opp.confidence}%\n\n`
        md += `${opp.description}\n\n`
        md += `- **Potential Value**: $${opp.potentialValue}B\n`
        md += `- **Time to Realize**: ${opp.timeToRealize}\n`
        md += `- **Related Routes**: ${opp.relatedRoutes.length}\n\n`
      })
      md += `---\n\n`
    }
    
    // Scenarios
    if (includeScenarios && data.scenarios) {
      md += `## Scenario Analysis\n\n`
      md += `Total: ${data.scenarios.length} scenarios\n\n`
      
      data.scenarios.forEach((scenario: any) => {
        md += `### ${scenario.name}\n\n`
        md += `**Category**: ${scenario.category.toUpperCase()} | **Probability**: ${scenario.probability}%\n\n`
        md += `${scenario.description}\n\n`
        md += `#### Impact Analysis\n\n`
        md += `- **Volume Change**: ${scenario.impact.volumeChange > 0 ? "+" : ""}${scenario.impact.volumeChange}%\n`
        md += `- **Delay Increase**: ${scenario.impact.delayIncrease > 0 ? "+" : ""}${scenario.impact.delayIncrease} days\n`
        md += `- **Cost Increase**: ${scenario.impact.costIncrease > 0 ? "+" : ""}${scenario.impact.costIncrease}%\n`
        md += `- **Affected Routes**: ${scenario.impact.affectedRoutes.length}\n`
        md += `- **Affected Chokepoints**: ${scenario.impact.affectedChokepoints.length}\n\n`
        md += `#### Mitigation Strategies\n\n`
        scenario.mitigationStrategies.forEach((strategy: string, idx: number) => {
          md += `${idx + 1}. ${strategy}\n`
        })
        md += `\n---\n\n`
      })
    }
    
    md += `## Appendix\n\n`
    md += `### Export Configuration\n\n`
    md += `- Routes Included: ${includeRoutes}\n`
    md += `- Chokepoints Included: ${includeChokepoints}\n`
    md += `- Risks Included: ${includeRisks}\n`
    md += `- Opportunities Included: ${includeOpportunities}\n`
    md += `- Scenarios Included: ${includeScenarios}\n\n`
    md += `### Data Sources\n\n`
    md += `This report is generated from synthetic trade intelligence data.\n`
    md += `For production use, replace mock data with real-time trade flows and risk assessments.\n\n`
    
    return md
  }

  const getFormatIcon = (fmt: ExportFormat) => {
    switch (fmt) {
      case "json":
        return <FileJson className="w-4 h-4" />
      case "csv":
        return <FileSpreadsheet className="w-4 h-4" />
      case "markdown":
        return <FileCode className="w-4 h-4" />
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          {t('export')}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t('exportData')}</DialogTitle>
          <DialogDescription>{t('chooseFormat')}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Format Selection */}
          <div>
            <Label className="text-sm font-semibold mb-3 block">{t('exportFormat')}</Label>
            <RadioGroup value={format} onValueChange={(v) => setFormat(v as ExportFormat)}>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="markdown" id="markdown" />
                  <Label htmlFor="markdown" className="flex items-center gap-2 cursor-pointer">
                    <FileCode className="w-4 h-4 text-muted-foreground" />
                    Markdown
                    <Badge variant="outline" className="text-xs">
                      {t('recommended')}
                    </Badge>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="json" id="json" />
                  <Label htmlFor="json" className="flex items-center gap-2 cursor-pointer">
                    <FileJson className="w-4 h-4 text-muted-foreground" />
                    JSON
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="csv" id="csv" />
                  <Label htmlFor="csv" className="flex items-center gap-2 cursor-pointer">
                    <FileSpreadsheet className="w-4 h-4 text-muted-foreground" />
                    CSV
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* Data Selection */}
          <div>
            <Label className="text-sm font-semibold mb-3 block">{t('includeData')}</Label>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="routes"
                  checked={includeRoutes}
                  onCheckedChange={(checked) => setIncludeRoutes(checked as boolean)}
                />
                <Label htmlFor="routes" className="cursor-pointer">
                  Trade Routes ({tradeRoutes.length})
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="chokepoints"
                  checked={includeChokepoints}
                  onCheckedChange={(checked) => setIncludeChokepoints(checked as boolean)}
                />
                <Label htmlFor="chokepoints" className="cursor-pointer">
                  Chokepoints ({chokepoints.length})
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="risks"
                  checked={includeRisks}
                  onCheckedChange={(checked) => setIncludeRisks(checked as boolean)}
                />
                <Label htmlFor="risks" className="cursor-pointer">
                  Risk Alerts ({riskAlerts.length})
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="opportunities"
                  checked={includeOpportunities}
                  onCheckedChange={(checked) => setIncludeOpportunities(checked as boolean)}
                />
                <Label htmlFor="opportunities" className="cursor-pointer">
                  Opportunities ({opportunities.length})
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="scenarios"
                  checked={includeScenarios}
                  onCheckedChange={(checked) => setIncludeScenarios(checked as boolean)}
                />
                <Label htmlFor="scenarios" className="cursor-pointer">
                  Scenarios ({scenarios.length})
                </Label>
              </div>
            </div>
          </div>

          {/* Export Summary */}
          <Card className="p-3 bg-muted/30">
            <div className="text-xs text-muted-foreground mb-1">{t('exportSummary')}</div>
            <div className="text-sm font-semibold text-foreground">
              {
                [includeRoutes, includeChokepoints, includeRisks, includeOpportunities, includeScenarios].filter(
                  Boolean,
                ).length
              }{" "}
              {t('datasetsSelected')}
            </div>
          </Card>

          <Button className="w-full" onClick={handleExport} disabled={exported}>
            {exported ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                {t('exportedSuccessfully')}
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                {t('exportButton')}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
