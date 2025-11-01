"use client"

import { useState, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { tradeRoutes } from "@/lib/mock-data"
import { Search, ArrowUpDown, ArrowUp, ArrowDown, X } from "lucide-react"

type SortField = "name" | "volume" | "risk" | "status" | "commodity"
type SortDirection = "asc" | "desc"

export function RoutesTable() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [riskFilter, setRiskFilter] = useState<string>("all")
  const [commodityFilter, setCommodityFilter] = useState<string>("all")
  const [sortField, setSortField] = useState<SortField>("volume")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")

  // Get unique commodities for filter
  const uniqueCommodities = useMemo(() => {
    return Array.from(new Set(tradeRoutes.map((route) => route.commodity)))
  }, [])

  // Filter and sort routes
  const filteredAndSortedRoutes = useMemo(() => {
    const filtered = tradeRoutes.filter((route) => {
      const matchesSearch =
        route.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        route.origin.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        route.destination.country.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus = statusFilter === "all" || route.status === statusFilter
      const matchesRisk = riskFilter === "all" || route.risk === riskFilter
      const matchesCommodity = commodityFilter === "all" || route.commodity === commodityFilter

      return matchesSearch && matchesStatus && matchesRisk && matchesCommodity
    })

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0

      switch (sortField) {
        case "name":
          comparison = a.name.localeCompare(b.name)
          break
        case "volume":
          comparison = a.volume - b.volume
          break
        case "risk":
          const riskOrder = { low: 0, medium: 1, high: 2, critical: 3 }
          comparison = riskOrder[a.risk] - riskOrder[b.risk]
          break
        case "status":
          comparison = a.status.localeCompare(b.status)
          break
        case "commodity":
          comparison = a.commodity.localeCompare(b.commodity)
          break
      }

      return sortDirection === "asc" ? comparison : -comparison
    })

    return filtered
  }, [searchQuery, statusFilter, riskFilter, commodityFilter, sortField, sortDirection])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  const clearFilters = () => {
    setSearchQuery("")
    setStatusFilter("all")
    setRiskFilter("all")
    setCommodityFilter("all")
  }

  const hasActiveFilters = searchQuery || statusFilter !== "all" || riskFilter !== "all" || commodityFilter !== "all"

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="w-4 h-4 ml-1 opacity-30" />
    return sortDirection === "asc" ? <ArrowUp className="w-4 h-4 ml-1" /> : <ArrowDown className="w-4 h-4 ml-1" />
  }

  return (
    <Card className="glass-panel p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-foreground">Trade Routes ({filteredAndSortedRoutes.length})</h2>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="w-4 h-4 mr-1" />
            Clear Filters
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search routes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Status Filter */}
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="at-risk">At Risk</SelectItem>
            <SelectItem value="disrupted">Disrupted</SelectItem>
          </SelectContent>
        </Select>

        {/* Risk Filter */}
        <Select value={riskFilter} onValueChange={setRiskFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Risk Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Risk Levels</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
          </SelectContent>
        </Select>

        {/* Commodity Filter */}
        <Select value={commodityFilter} onValueChange={setCommodityFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Commodity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Commodities</SelectItem>
            {uniqueCommodities.map((commodity) => (
              <SelectItem key={commodity} value={commodity}>
                {commodity}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort("name")}
                  className="flex items-center font-semibold"
                >
                  Route
                  <SortIcon field="name" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort("status")}
                  className="flex items-center font-semibold"
                >
                  Status
                  <SortIcon field="status" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort("risk")}
                  className="flex items-center font-semibold"
                >
                  Risk
                  <SortIcon field="risk" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort("volume")}
                  className="flex items-center font-semibold"
                >
                  Volume
                  <SortIcon field="volume" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort("commodity")}
                  className="flex items-center font-semibold"
                >
                  Commodity
                  <SortIcon field="commodity" />
                </Button>
              </TableHead>
              <TableHead>Origin → Destination</TableHead>
              <TableHead className="text-right">Alternatives</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedRoutes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No routes found matching your filters
                </TableCell>
              </TableRow>
            ) : (
              filteredAndSortedRoutes.map((route) => (
                <TableRow key={route.id} className="hover:bg-accent/5 cursor-pointer">
                  <TableCell className="font-medium">
                    <div className="text-sm text-foreground">{route.name}</div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        route.status === "active" ? "default" : route.status === "at-risk" ? "secondary" : "destructive"
                      }
                      className="text-xs"
                    >
                      {route.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        route.risk === "critical"
                          ? "destructive"
                          : route.risk === "high"
                            ? "destructive"
                            : route.risk === "medium"
                              ? "secondary"
                              : "default"
                      }
                      className="text-xs"
                    >
                      {route.risk}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-semibold text-foreground">${route.volume}B</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">{route.commodity}</span>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs text-muted-foreground">
                      {route.origin.country} → {route.destination.country}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="text-sm text-foreground">{route.alternativeRoutes}</span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Summary */}
      <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
        <div>
          Showing {filteredAndSortedRoutes.length} of {tradeRoutes.length} routes
        </div>
        <div className="flex items-center gap-4">
          <span>Total Volume: ${filteredAndSortedRoutes.reduce((sum, r) => sum + r.volume, 0)}B</span>
        </div>
      </div>
    </Card>
  )
}
