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
import { Download, FileJson, FileSpreadsheet, FileText, Check } from "lucide-react"

type ExportFormat = "json" | "csv" | "pdf"

export function ExportDialog() {
  const [format, setFormat] = useState<ExportFormat>("json")
  const [includeRoutes, setIncludeRoutes] = useState(true)
  const [includeChokepoints, setIncludeChokepoints] = useState(true)
  const [includeRisks, setIncludeRisks] = useState(true)
  const [includeOpportunities, setIncludeOpportunities] = useState(true)
  const [includeScenarios, setIncludeScenarios] = useState(false)
  const [exported, setExported] = useState(false)

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

      case "pdf":
        // For PDF, we'd normally use a library like jsPDF
        // For now, create a text representation
        content = `Trade Intelligence Report\n\n`
        if (includeRoutes) {
          content += `Routes: ${tradeRoutes.length}\n`
        }
        if (includeChokepoints) {
          content += `Chokepoints: ${chokepoints.length}\n`
        }
        if (includeRisks) {
          content += `Risk Alerts: ${riskAlerts.length}\n`
        }
        filename = "trade-intelligence-report.txt"
        mimeType = "text/plain"
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

  const getFormatIcon = (fmt: ExportFormat) => {
    switch (fmt) {
      case "json":
        return <FileJson className="w-4 h-4" />
      case "csv":
        return <FileSpreadsheet className="w-4 h-4" />
      case "pdf":
        return <FileText className="w-4 h-4" />
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Export Data</DialogTitle>
          <DialogDescription>Choose the format and data to export</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Format Selection */}
          <div>
            <Label className="text-sm font-semibold mb-3 block">Export Format</Label>
            <RadioGroup value={format} onValueChange={(v) => setFormat(v as ExportFormat)}>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="json" id="json" />
                  <Label htmlFor="json" className="flex items-center gap-2 cursor-pointer">
                    <FileJson className="w-4 h-4 text-muted-foreground" />
                    JSON
                    <Badge variant="outline" className="text-xs">
                      Recommended
                    </Badge>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="csv" id="csv" />
                  <Label htmlFor="csv" className="flex items-center gap-2 cursor-pointer">
                    <FileSpreadsheet className="w-4 h-4 text-muted-foreground" />
                    CSV
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pdf" id="pdf" />
                  <Label htmlFor="pdf" className="flex items-center gap-2 cursor-pointer">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    PDF Report
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* Data Selection */}
          <div>
            <Label className="text-sm font-semibold mb-3 block">Include Data</Label>
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
            <div className="text-xs text-muted-foreground mb-1">Export Summary</div>
            <div className="text-sm font-semibold text-foreground">
              {
                [includeRoutes, includeChokepoints, includeRisks, includeOpportunities, includeScenarios].filter(
                  Boolean,
                ).length
              }{" "}
              datasets selected
            </div>
          </Card>

          <Button className="w-full" onClick={handleExport} disabled={exported}>
            {exported ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Exported Successfully
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
