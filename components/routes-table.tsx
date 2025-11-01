"use client"

import { useState, useMemo, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { tradeRoutes } from "@/lib/mock-data"
import { Search, ArrowUpDown, ArrowUp, ArrowDown, X, Share2, Check } from "lucide-react"
import { toast } from "sonner"
import { useLanguage } from "@/components/language-provider"
import { getTranslation } from "@/lib/i18n"

type SortField = "name" | "volume" | "risk" | "status" | "commodity"
type SortDirection = "asc" | "desc"

// Helper to parse URL params safely (client-side only)
const getUrlParam = (name: string): string => {
  if (typeof window === 'undefined') return ''
  const params = new URLSearchParams(window.location.search)
  return params.get(name) || ''
}

export function RoutesTable() {
  const { language } = useLanguage()
  // Initialize from URL params or defaults
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [riskFilter, setRiskFilter] = useState<string>("all")
  const [commodityFilter, setCommodityFilter] = useState<string>("all")
  const [sortField, setSortField] = useState<SortField>("volume")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")
  const [copiedLink, setCopiedLink] = useState(false)
  
  const t = (key: keyof import('@/lib/i18n').Translations) => getTranslation(language, key)
  
  // Load from URL on mount
  useEffect(() => {
    setSearchQuery(getUrlParam("search"))
    setStatusFilter(getUrlParam("status") || "all")
    setRiskFilter(getUrlParam("risk") || "all")
    setCommodityFilter(getUrlParam("commodity") || "all")
    const sort = getUrlParam("sort") as SortField
    const dir = getUrlParam("dir") as SortDirection
    if (sort) setSortField(sort)
    if (dir) setSortDirection(dir)
  }, [])
  
  // Sync filters to URL (debounced for search)
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const params = new URLSearchParams()
    if (searchQuery) params.set("search", searchQuery)
    if (statusFilter !== "all") params.set("status", statusFilter)
    if (riskFilter !== "all") params.set("risk", riskFilter)
    if (commodityFilter !== "all") params.set("commodity", commodityFilter)
    if (sortField !== "volume") params.set("sort", sortField)
    if (sortDirection !== "desc") params.set("dir", sortDirection)
    
    const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname
    window.history.replaceState({}, '', newUrl)
  }, [searchQuery, statusFilter, riskFilter, commodityFilter, sortField, sortDirection])
  
  // Share link handler
  const handleShareLink = async () => {
    if (typeof window === 'undefined') return
    
    const url = window.location.href
    try {
      await navigator.clipboard.writeText(url)
      setCopiedLink(true)
      toast.success("Link copied to clipboard")
      setTimeout(() => setCopiedLink(false), 2000)
    } catch (err) {
      toast.error("Failed to copy link")
    }
  }

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
        <h2 className="text-xl font-semibold text-foreground">{t('tradeRoutes')} ({filteredAndSortedRoutes.length})</h2>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="w-4 h-4 mr-1" />
              {t('clearFilters')}
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={handleShareLink} title="Share current filter state">
            {copiedLink ? (
              <>
                <Check className="w-4 h-4 mr-1" />
                {t('copied')}
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 mr-1" />
                {t('share')}
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={t('searchRoutes')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Status Filter */}
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <SelectValue placeholder={t('status')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('allStatuses')}</SelectItem>
            <SelectItem value="active">{t('active')}</SelectItem>
            <SelectItem value="at-risk">{t('atRiskStatus')}</SelectItem>
            <SelectItem value="disrupted">{t('disrupted')}</SelectItem>
          </SelectContent>
        </Select>

        {/* Risk Filter */}
        <Select value={riskFilter} onValueChange={setRiskFilter}>
          <SelectTrigger>
            <SelectValue placeholder={t('riskLevel')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('allRiskLevels')}</SelectItem>
            <SelectItem value="low">{t('low')}</SelectItem>
            <SelectItem value="medium">{t('medium')}</SelectItem>
            <SelectItem value="high">{t('high')}</SelectItem>
            <SelectItem value="critical">{t('critical')}</SelectItem>
          </SelectContent>
        </Select>

        {/* Commodity Filter */}
        <Select value={commodityFilter} onValueChange={setCommodityFilter}>
          <SelectTrigger>
            <SelectValue placeholder={t('commodity')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('allCommodities')}</SelectItem>
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
                  {t('route')}
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
                  {t('status')}
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
                  {t('riskLevel')}
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
                  {t('volume')}
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
                  {t('commodity')}
                  <SortIcon field="commodity" />
                </Button>
              </TableHead>
              <TableHead>{t('originDestination')}</TableHead>
              <TableHead className="text-right">{t('alternatives')}</TableHead>
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
          {t('showing')} {filteredAndSortedRoutes.length} {t('of')} {tradeRoutes.length} routes
        </div>
        <div className="flex items-center gap-4">
          <span>{t('totalVolume')}: ${filteredAndSortedRoutes.reduce((sum, r) => sum + r.volume, 0)}B</span>
        </div>
      </div>
    </Card>
  )
}
