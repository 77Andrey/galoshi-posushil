"use client"

import type React from "react"
import { useEffect, useRef, useState, useCallback, useMemo } from "react"
import { tradeRoutes, chokepoints } from "@/lib/mock-data"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ZoomIn, ZoomOut, RotateCcw, Layers, Radio, Maximize2 } from "lucide-react"

interface WorldMapProps {
  selectedRoute?: string | null
  onRouteSelect?: (routeId: string | null) => void
}

// Risk color palette - Holographic Glass System
const riskColors = {
  low: "#22D3A6", // Mint
  medium: "#F6C453", // Amber
  high: "#FFB020", // Orange-amber
  critical: "#FF4D4F", // Coral-red
}

// Colorblind-safe palette (optional)
const colorblindColors = {
  low: "#2BB3FF", // Blue
  medium: "#A78BFA", // Purple
  high: "#F59E0B", // Amber
  critical: "#EF4444", // Red
}

// Risk stroke patterns for accessibility
const riskPatterns = {
  low: "none",
  medium: "12,4",
  high: "6,4",
  critical: "none",
}

// Simple SVG map projection (Equirectangular)
const latLngToXY = (lat: number, lng: number, width: number, height: number) => {
  const x = ((lng + 180) / 360) * width
  const y = ((90 - lat) / 180) * height
  return { x, y }
}

// Calculate smooth arc using cubic bezier for great-circle-like appearance
const generateArcPath = (
  from: { x: number; y: number },
  to: { x: number; y: number },
  risk: string
) => {
  const midX = (from.x + to.x) / 2
  const midY = (from.y + to.y) / 2
  const dx = to.x - from.x
  const dy = to.y - from.y
  
  // Adjust curvature based on distance and risk level
  const baseCurvature = 0.3
  const curvature = risk === "critical" ? baseCurvature + 0.1 : baseCurvature
  
  const controlX1 = midX - dy * curvature * 0.5
  const controlY1 = midY + dx * curvature * 0.5
  const controlX2 = midX + dy * curvature * 0.5
  const controlY2 = midY - dx * curvature * 0.5
  
  return `M ${from.x} ${from.y} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${to.x} ${to.y}`
}

interface ArcProps {
  route: any
  width: number
  height: number
  isSelected: boolean
  isHovered: boolean
  isFocused: boolean
  useColorblind: boolean
  shouldAnimate: boolean
  progress: number
}

// Enhanced Animated Arc component
const AnimatedArc = ({
  route,
  width,
  height,
  isSelected,
  isHovered,
  isFocused,
  useColorblind,
  shouldAnimate,
  progress,
}: ArcProps) => {
  const origin = latLngToXY(route.origin.lat, route.origin.lng, width, height)
  const destination = latLngToXY(route.destination.lat, route.destination.lng, width, height)
  
  const palette = useColorblind ? colorblindColors : riskColors
  const strokeColor = palette[route.risk as keyof typeof palette]
  
  // Dynamic stroke width based on volume and state
  const baseWidth = Math.max(1.5, Math.min(4, 1 + route.volume / 150))
  const hoverWidth = baseWidth + 1
  const selectedWidth = baseWidth + 1.5
  
  const strokeWidth = isSelected ? selectedWidth : isHovered ? hoverWidth : baseWidth
  
  // Opacity and effects
  const opacity = isSelected ? 1 : isHovered ? 1 : 0.7
  const isDisrupted = route.status === "disrupted"
  const strokeDash = isDisrupted ? "8,4" : riskPatterns[route.risk as keyof typeof riskPatterns]
  
  // Calculate particle position
  const path = generateArcPath(origin, destination, route.risk)
  
  let particleX = 0
  let particleY = 0
  if (shouldAnimate && typeof document !== "undefined") {
    try {
      const pathElement = document.createElementNS("http://www.w3.org/2000/svg", "path")
      pathElement.setAttribute("d", path)
      
      if (pathElement.getTotalLength) {
        const length = pathElement.getTotalLength()
        const point = pathElement.getPointAtLength(length * progress)
        particleX = point.x
        particleY = point.y
      }
    } catch (e) {
      // Fallback to midpoint during SSR
      particleX = (origin.x + destination.x) / 2
      particleY = (origin.y + destination.y) / 2
    }
  }
  
  const showGlow = isSelected || isHovered || route.risk === "critical"
  
  return (
    <g opacity={opacity} style={{ isolation: "isolate" }}>
      {/* Glow filter for important arcs */}
      {showGlow && (
        <defs>
          <filter id={`glow-${route.id}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      )}
      
      {/* Main arc */}
      <path
        d={path}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={strokeDash}
        filter={showGlow ? `url(#glow-${route.id})` : undefined}
        className="transition-all duration-200 cursor-pointer"
        style={{
          strokeLinecap: "round",
          strokeLinejoin: "round",
        }}
      />
      
      {/* Animated flow particle for active routes */}
      {(route.status === "active" || isSelected) && shouldAnimate && (
        <circle
          cx={particleX}
          cy={particleY}
          r={isSelected ? 4 : 3}
          fill={strokeColor}
          opacity={0.9}
          className="animate-pulse"
        />
      )}
    </g>
  )
}

interface ChokepointProps {
  point: any
  width: number
  height: number
  isHovered: boolean
  isFocused: boolean
  useColorblind: boolean
}

// Enhanced Chokepoint component
const ChokepointMarker = ({
  point,
  width,
  height,
  isHovered,
  isFocused,
  useColorblind,
}: ChokepointProps) => {
  const pos = latLngToXY(point.lat, point.lng, width, height)
  const palette = useColorblind ? colorblindColors : riskColors
  const color = palette[point.riskLevel as keyof typeof palette]
  
  // Size based on throughput
  const throughputScale = Math.max(0.5, Math.min(1.5, point.throughput / 20))
  const baseRadius = 4 + throughputScale * 6
  const hoverRadius = baseRadius + 2
  
  const radius = isHovered || isFocused ? hoverRadius : baseRadius
  const glowRadius = radius * 2.5
  
  const hasIncidents = point.recentIncidents > 0
  const showGlow = isHovered || hasIncidents || point.riskLevel === "critical"
  
  return (
    <g>
      {/* Outer glow ring */}
      {showGlow && (
        <circle
          cx={pos.x}
          cy={pos.y}
          r={glowRadius}
          fill={color}
          opacity={0.2}
          style={{ filter: "blur(8px)" }}
          className={isHovered ? "animate-pulse" : ""}
        />
      )}
      
      {/* Main marker */}
      <circle
        cx={pos.x}
        cy={pos.y}
        r={radius}
        fill={color}
        stroke="rgba(255, 255, 255, 0.9)"
        strokeWidth={1.5}
        className="transition-all duration-200 cursor-pointer"
        style={{
          filter: showGlow ? "drop-shadow(0 0 4px " + color + ")" : undefined,
        }}
      />
      
      {/* Incident indicator (inner dot) */}
      {hasIncidents && (
        <circle
          cx={pos.x}
          cy={pos.y}
          r={radius * 0.4}
          fill="rgba(255, 255, 255, 0.9)"
        />
      )}
    </g>
  )
}

export function WorldMap({ selectedRoute, onRouteSelect }: WorldMapProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 1000, height: 600 })
  const [hoveredRoute, setHoveredRoute] = useState<string | null>(null)
  const [hoveredPoint, setHoveredPoint] = useState<string | null>(null)
  const [selectedRoutes, setSelectedRoutes] = useState<Set<string>>(new Set())
  const [focusedElement, setFocusedElement] = useState<string | null>(null)
  const [isColorblind, setIsColorblind] = useState(false)
  const [animationProgress, setAnimationProgress] = useState(0)
  const [viewBox, setViewBox] = useState({ x: 0, y: 0, scale: 1 })
  const [isPanning, setIsPanning] = useState(false)
  const [panStart, setPanStart] = useState({ x: 0, y: 0 })
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null)
  const [tooltipData, setTooltipData] = useState<any>(null)
  const animationFrameRef = useRef<number>()
  const mountedRef = useRef(false)
  
  // Detect reduced motion preference
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches
  }, [])
  
  // Update dimensions - immediate on mount
  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true
      
      // Immediate update on mount
    const updateDimensions = () => {
        if (containerRef.current) {
        setDimensions({
            width: containerRef.current.clientWidth || 1000,
            height: containerRef.current.clientHeight || 600,
        })
      }
    }

      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(() => {
    updateDimensions()
      })
      
    window.addEventListener("resize", updateDimensions)
    return () => window.removeEventListener("resize", updateDimensions)
    }
  }, [])

  // Animation loop (60 FPS)
  useEffect(() => {
    if (prefersReducedMotion) return
    
    const animate = () => {
      setAnimationProgress((prev) => (prev + 0.016) % 1)
      animationFrameRef.current = requestAnimationFrame(animate)
    }
    
    animationFrameRef.current = requestAnimationFrame(animate)
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [prefersReducedMotion])
  
  // Sort routes by risk priority for proper layering
  const sortedRoutes = useMemo(() => {
    const riskOrder = { critical: 0, high: 1, medium: 2, low: 3 }
    return [...tradeRoutes].sort((a, b) => {
      const priorityA = riskOrder[a.risk as keyof typeof riskOrder]
      const priorityB = riskOrder[b.risk as keyof typeof riskOrder]
      return priorityA - priorityB
    })
  }, [])
  
  // Smart animation throttling - only animate top N routes
  const ANIMATION_LIMIT = 20
  const shouldAnimateRoute = useCallback((route: any, index: number) => {
    if (prefersReducedMotion) return false
    // Animate top routes by volume, selected routes, or hovered routes
    const topByVolume = index < 10
    const isImportant = route.risk === "critical" || route.risk === "high"
    const isSpecial = selectedRoutes.has(route.id) || hoveredRoute === route.id
    return (topByVolume || isImportant || isSpecial) && index < ANIMATION_LIMIT
  }, [prefersReducedMotion, selectedRoutes, hoveredRoute])
  
  // Route click handler with Shift support for multi-select
  const handleRouteClick = useCallback((e: React.MouseEvent, routeId: string) => {
    if (e.shiftKey) {
      setSelectedRoutes((prev) => {
        const newSet = new Set(prev)
        if (newSet.has(routeId)) {
          newSet.delete(routeId)
        } else {
          newSet.add(routeId)
        }
        return newSet
      })
    } else {
      // Single select - update parent component
      if (selectedRoutes.has(routeId)) {
        setSelectedRoutes(new Set())
        onRouteSelect?.(null)
      } else {
        setSelectedRoutes(new Set([routeId]))
        onRouteSelect?.(routeId)
      }
    }
  }, [selectedRoutes, onRouteSelect])
  
  // Pan handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.target === svgRef.current) {
      setIsPanning(true)
      setPanStart({ x: e.clientX, y: e.clientY })
    }
  }, [])
  
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isPanning && svgRef.current) {
      const dx = (e.clientX - panStart.x) / viewBox.scale
      const dy = (e.clientY - panStart.y) / viewBox.scale
      setViewBox((prev) => ({
        ...prev,
        x: prev.x - dx,
        y: prev.y - dy,
      }))
      setPanStart({ x: e.clientX, y: e.clientY })
    }
    
    // Update tooltip position
    if (hoveredRoute && svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect()
      setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
    }
  }, [isPanning, panStart, viewBox.scale, hoveredRoute])
  
  const handleMouseUp = useCallback(() => {
    setIsPanning(false)
  }, [])
  
  // Zoom handlers
  const handleZoom = useCallback((delta: number) => {
    setViewBox((prev) => ({
      ...prev,
      scale: Math.max(0.5, Math.min(3, prev.scale + delta)),
    }))
  }, [])
  
  const handleResetView = useCallback(() => {
    setViewBox({ x: 0, y: 0, scale: 1 })
  }, [])
  
  const handleFitToData = useCallback(() => {
    // Calculate bounds of all routes and chokepoints
    const allLats = [
      ...tradeRoutes.flatMap((r) => [r.origin.lat, r.destination.lat]),
      ...chokepoints.map((cp) => cp.lat),
    ]
    const allLngs = [
      ...tradeRoutes.flatMap((r) => [r.origin.lng, r.destination.lng]),
      ...chokepoints.map((cp) => cp.lng),
    ]
    
    const minLat = Math.min(...allLats)
    const maxLat = Math.max(...allLats)
    const minLng = Math.min(...allLngs)
    const maxLng = Math.max(...allLngs)
    
    // Calculate padding
    const latPadding = (maxLat - minLat) * 0.1
    const lngPadding = (maxLng - minLng) * 0.1
    
    // TODO: Adjust viewBox based on bounds
    handleResetView()
  }, [handleResetView])
  
  // Route hover handler
  const handleRouteHover = useCallback((routeId: string, route: any, e: React.MouseEvent) => {
    setHoveredRoute(routeId)
    if (svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect()
      setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
    }
    setTooltipData(route)
  }, [])
  
  const handleRouteLeave = useCallback(() => {
    setHoveredRoute(null)
    setTooltipPos(null)
    setTooltipData(null)
  }, [])
  
  // Count routes by risk level
  const riskCounts = useMemo(() => {
    const counts = { low: 0, medium: 0, high: 0, critical: 0 }
    tradeRoutes.forEach((route) => {
      counts[route.risk as keyof typeof counts]++
    })
    return counts
  }, [])
  
  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedRoutes(new Set())
        setFocusedElement(null)
        onRouteSelect?.(null)
      }
    }
    
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [onRouteSelect])
  
  return (
    <div ref={containerRef} className="relative w-full h-full bg-[#0A0F14] rounded-[14px] overflow-hidden">
      {/* SVG Map */}
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        viewBox={`${viewBox.x} ${viewBox.y} ${dimensions.width / viewBox.scale} ${dimensions.height / viewBox.scale}`}
        className="cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <defs>
          {/* Grid pattern */}
          <pattern id="grid" width="60" height="40" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="60" y2="0" stroke="rgba(255, 255, 255, 0.04)" strokeWidth="0.5" />
            <line x1="0" y1="0" x2="0" y2="40" stroke="rgba(255, 255, 255, 0.04)" strokeWidth="0.5" />
          </pattern>
          
          {/* Gradient for hover effects */}
          <linearGradient id="mintToCyan" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#22D3A6" />
            <stop offset="100%" stopColor="#33D1FF" />
          </linearGradient>
        </defs>
        
        {/* Grid background */}
        <rect width="100%" height="100%" fill="url(#grid)" />
        
        {/* Latitude and longitude lines */}
        <g opacity="0.06">
          {[-60, -30, 0, 30, 60].map((lat) => {
            const y = ((90 - lat) / 180) * dimensions.height
            return (
              <line
                key={`lat-${lat}`}
                x1="0"
                y1={y}
                x2={dimensions.width}
                y2={y}
                stroke="rgba(255, 255, 255, 0.6)"
                strokeWidth="1"
                strokeDasharray="5,5"
              />
            )
          })}
          {[-180, -120, -60, 0, 60, 120, 180].map((lng) => {
            const x = ((lng + 180) / 360) * dimensions.width
            return (
              <line
                key={`lng-${lng}`}
                x1={x}
                y1="0"
                x2={x}
                y2={dimensions.height}
                stroke="rgba(255, 255, 255, 0.6)"
                strokeWidth="1"
                strokeDasharray="5,5"
              />
            )
          })}
        </g>
        
        {/* Trade routes (sorted by risk) */}
        {sortedRoutes.map((route, index) => (
          <g
            key={route.id}
            onClick={(e) => handleRouteClick(e, route.id)}
            onMouseEnter={(e) => handleRouteHover(route.id, route, e)}
            onMouseLeave={handleRouteLeave}
            onFocus={() => setFocusedElement(route.id)}
            onBlur={() => setFocusedElement(null)}
            tabIndex={0}
            role="button"
            aria-label={`Trade route: ${route.name}`}
          >
            <AnimatedArc
              route={route}
              width={dimensions.width}
              height={dimensions.height}
              isSelected={selectedRoutes.has(route.id)}
              isHovered={hoveredRoute === route.id}
              isFocused={focusedElement === route.id}
              useColorblind={isColorblind}
              shouldAnimate={shouldAnimateRoute(route, index)}
              progress={animationProgress}
            />
          </g>
        ))}
        
        {/* Chokepoints */}
        {chokepoints.map((point) => {
          const isHovered = hoveredPoint === point.id
          const isFocused = focusedElement === point.id
          
          return (
            <g
              key={point.id}
              onMouseEnter={() => setHoveredPoint(point.id)}
              onMouseLeave={() => setHoveredPoint(null)}
              onFocus={() => setFocusedElement(point.id)}
              onBlur={() => setFocusedElement(null)}
              tabIndex={0}
              role="button"
              aria-label={`Chokepoint: ${point.name}`}
            >
              <ChokepointMarker
                point={point}
                width={dimensions.width}
                height={dimensions.height}
                isHovered={isHovered || isFocused}
                isFocused={isFocused}
                useColorblind={isColorblind}
              />
            </g>
          )
        })}
      </svg>
      
      {/* Floating Legend */}
      <div className="absolute bottom-4 left-4 bg-black/40 backdrop-blur-xl border border-white/10 rounded-[12px] p-4 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
        <div className="text-xs font-semibold text-foreground mb-3 tracking-wide uppercase">
          Risk Levels
        </div>
        <div className="space-y-2.5">
          {Object.entries(riskColors).map(([risk, color]) => (
            <div key={risk} className="flex items-center justify-between gap-3 min-w-[140px]">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: isColorblind ? colorblindColors[risk as keyof typeof colorblindColors] : color,
                  }}
                />
                <span className="text-xs text-muted-foreground capitalize font-medium">
                  {risk}
                </span>
        </div>
              <Badge variant="outline" className="text-xs px-2 py-0 h-5">
                {riskCounts[risk as keyof typeof riskCounts]}
              </Badge>
        </div>
          ))}
        </div>
      </div>

      {/* Control Panel */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleZoom(0.2)}
          className="bg-black/40 backdrop-blur-xl border-white/10 h-8 w-8 p-0"
        >
          <ZoomIn className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleZoom(-0.2)}
          className="bg-black/40 backdrop-blur-xl border-white/10 h-8 w-8 p-0"
        >
          <ZoomOut className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleResetView}
          className="bg-black/40 backdrop-blur-xl border-white/10 h-8 w-8 p-0"
          title="Reset view"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleFitToData}
          className="bg-black/40 backdrop-blur-xl border-white/10 h-8 w-8 p-0"
          title="Fit to data"
        >
          <Maximize2 className="w-4 h-4" />
        </Button>
        <Button
          variant={isColorblind ? "default" : "outline"}
          size="sm"
          onClick={() => setIsColorblind(!isColorblind)}
          className="bg-black/40 backdrop-blur-xl border-white/10 h-8 w-8 p-0"
          title="Colorblind-safe mode"
        >
          <Layers className="w-4 h-4" />
        </Button>
      </div>
      
      {/* Glass Tooltip */}
      {tooltipPos && tooltipData && (
        <div
          className="absolute pointer-events-none bg-black/60 backdrop-blur-xl border border-white/20 rounded-[12px] p-4 shadow-[0_8px_32px_rgba(0,0,0,0.4)] min-w-[280px]"
          style={{
            left: `${tooltipPos.x + 20}px`,
            top: `${tooltipPos.y - 40}px`,
            transform: tooltipPos.x > dimensions.width - 320 ? "translateX(-100%)" : undefined,
          }}
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              {tooltipData.status === "active" && (
                <Radio className="w-3 h-3 text-[#22D3A6] animate-pulse" />
              )}
              <h4 className="text-sm font-semibold text-foreground leading-tight">
                {tooltipData.name}
              </h4>
            </div>
            <Badge
              variant={
                tooltipData.risk === "critical" || tooltipData.risk === "high"
                  ? "destructive"
                  : tooltipData.risk === "medium"
                    ? "secondary"
                    : "default"
              }
              className="text-xs"
            >
              {tooltipData.risk}
            </Badge>
          </div>
          
          <div className="space-y-1.5">
            <div className="text-xs text-muted-foreground leading-relaxed">
              <span className="font-semibold">{tooltipData.origin.country}</span> →{" "}
              <span className="font-semibold">{tooltipData.destination.country}</span>
            </div>
            
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Commodity:</span>
              <span className="text-foreground font-medium">{tooltipData.commodity}</span>
            </div>
            
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Volume:</span>
              <span className="text-foreground font-medium">${tooltipData.volume}B USD</span>
            </div>
            
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Status:</span>
              <span className="text-foreground font-medium capitalize">{tooltipData.status}</span>
              </div>
            
            {tooltipData.geopoliticalFactors.length > 0 && (
              <div className="pt-2 border-t border-white/10">
                <div className="text-xs text-muted-foreground mb-1">Recent Events:</div>
                <div className="text-xs text-foreground leading-relaxed">
                  {tooltipData.geopoliticalFactors[0]}
              </div>
              </div>
          )}
          </div>
        </div>
      )}
      
      {/* Info overlay (bottom right) */}
      <div className="absolute bottom-4 right-4 bg-black/40 backdrop-blur-xl border border-white/10 rounded-[12px] px-3 py-2 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="w-2 h-2 rounded-full bg-[#22D3A6] animate-pulse" />
          <span className="font-medium">Live Data</span>
          <span className="text-white/40">•</span>
          <span>
            {prefersReducedMotion ? "Reduced motion" : "Animations on"}
          </span>
        </div>
      </div>
    </div>
  )
}
