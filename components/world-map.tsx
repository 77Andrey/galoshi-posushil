"use client"

import type React from "react"
import { useEffect, useRef, useState, useCallback, useMemo } from "react"
import { tradeRoutes, chokepoints } from "@/lib/mock-data"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ZoomIn, ZoomOut, RotateCcw, Layers, Radio, Maximize2, Globe } from "lucide-react"

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

interface BasemapProps {
  width: number
  height: number
  showBasemap: boolean
}

// World basemap layer with simplified continents
const WorldBasemap = ({ width, height, showBasemap }: BasemapProps) => {
  if (!showBasemap) return null
  
  // Simplified continent outlines (Equirectangular projection)
  // Scaled for 1000px width reference - will scale to actual dimensions
  const scaleX = width / 1000
  const scaleY = height / 600
  
  const continents = [
    // Africa outline (detailed with curves)
    `M ${445*scaleX} ${157*scaleY} C ${455*scaleX} ${148*scaleY}, ${465*scaleX} ${140*scaleY}, ${475*scaleX} ${130*scaleY} 
     L ${495*scaleX} ${102*scaleY} C ${505*scaleX} ${90*scaleY}, ${515*scaleX} ${85*scaleY}, ${525*scaleX} ${88*scaleY}
     L ${545*scaleX} ${115*scaleY} C ${555*scaleX} ${145*scaleY}, ${562*scaleX} ${195*scaleY}, ${567*scaleX} ${245*scaleY}
     L ${565*scaleX} ${295*scaleY} C ${562*scaleX} ${320*scaleY}, ${555*scaleX} ${345*scaleY}, ${545*scaleX} ${375*scaleY}
     L ${528*scaleX} ${415*scaleY} C ${518*scaleX} ${435*scaleY}, ${505*scaleX} ${452*scaleY}, ${490*scaleX} ${470*scaleY}
     L ${468*scaleX} ${477*scaleY} C ${453*scaleX} ${479*scaleY}, ${438*scaleX} ${478*scaleY}, ${423*scaleX} ${472*scaleY}
     L ${405*scaleX} ${460*scaleY} C ${395*scaleX} ${448*scaleY}, ${387*scaleX} ${434*scaleY}, ${383*scaleX} ${418*scaleY}
     L ${381*scaleX} ${395*scaleY} C ${380*scaleX} ${362*scaleY}, ${385*scaleX} ${325*scaleY}, ${393*scaleX} ${295*scaleY}
     L ${403*scaleX} ${268*scaleY} C ${410*scaleX} ${242*scaleY}, ${420*scaleX} ${220*scaleY}, ${432*scaleX} ${195*scaleY}
     L ${442*scaleX} ${172*scaleY} Z`,
    // Europe outline
    `M ${495*scaleX} ${103*scaleY} L ${530*scaleX} ${68*scaleY} L ${570*scaleX} ${52*scaleY} L ${610*scaleX} ${48*scaleY} L ${650*scaleX} ${60*scaleY} L ${680*scaleX} ${85*scaleY} L ${695*scaleX} ${120*scaleY} L ${698*scaleX} ${155*scaleY} L ${690*scaleX} ${185*scaleY} L ${675*scaleX} ${208*scaleY} L ${655*scaleX} ${220*scaleY} L ${630*scaleX} ${225*scaleY} L ${605*scaleX} ${218*scaleY} L ${585*scaleX} ${205*scaleY} L ${570*scaleX} ${188*scaleY} L ${558*scaleX} ${168*scaleY} L ${545*scaleX} ${150*scaleY} L ${525*scaleX} ${135*scaleY} L ${505*scaleX} ${118*scaleY} Z`,
    // Asia outline (mainland, including Middle East)
    `M ${555*scaleX} ${98*scaleY} L ${600*scaleX} ${75*scaleY} L ${670*scaleX} ${60*scaleY} L ${750*scaleX} ${52*scaleY} L ${830*scaleX} ${55*scaleY} L ${900*scaleX} ${70*scaleY} L ${948*scaleX} ${95*scaleY} L ${970*scaleX} ${130*scaleY} L ${975*scaleX} ${172*scaleY} L ${968*scaleX} ${215*scaleY} L ${950*scaleX} ${252*scaleY} L ${920*scaleX} ${280*scaleY} L ${882*scaleX} ${300*scaleY} L ${835*scaleX} ${312*scaleY} L ${785*scaleX} ${318*scaleY} L ${735*scaleX} ${315*scaleY} L ${688*scaleX} ${305*scaleY} L ${645*scaleX} ${290*scaleY} L ${608*scaleX} ${270*scaleY} L ${575*scaleX} ${248*scaleY} L ${555*scaleX} ${225*scaleY} L ${540*scaleX} ${198*scaleY} L ${528*scaleX} ${170*scaleY} L ${520*scaleX} ${142*scaleY} L ${535*scaleX} ${118*scaleY} Z`,
    // North America outline
    `M ${190*scaleX} ${75*scaleY} L ${235*scaleX} ${52*scaleY} L ${285*scaleX} ${38*scaleY} L ${340*scaleX} ${32*scaleY} L ${395*scaleX} ${40*scaleY} L ${445*scaleX} ${62*scaleY} L ${485*scaleX} ${95*scaleY} L ${508*scaleX} ${135*scaleY} L ${515*scaleX} ${178*scaleY} L ${510*scaleX} ${220*scaleY} L ${495*scaleX} ${255*scaleY} L ${470*scaleX} ${280*scaleY} L ${440*scaleX} ${295*scaleY} L ${408*scaleX} ${302*scaleY} L ${375*scaleX} ${298*scaleY} L ${345*scaleX} ${285*scaleY} L ${320*scaleX} ${265*scaleY} L ${302*scaleX} ${240*scaleY} L ${290*scaleX} ${212*scaleY} L ${285*scaleX} ${182*scaleY} L ${286*scaleX} ${152*scaleY} L ${293*scaleX} ${125*scaleY} L ${305*scaleX} ${102*scaleY} L ${325*scaleX} ${85*scaleY} L ${345*scaleX} ${75*scaleY} L ${165*scaleX} ${142*scaleY} L ${175*scaleX} ${108*scaleY} Z`,
    // South America outline
    `M ${268*scaleX} ${248*scaleY} L ${315*scaleX} ${232*scaleY} L ${365*scaleX} ${225*scaleY} L ${415*scaleX} ${228*scaleY} L ${458*scaleX} ${242*scaleY} L ${493*scaleX} ${268*scaleY} L ${515*scaleX} ${302*scaleY} L ${528*scaleX} ${342*scaleY} L ${530*scaleX} ${385*scaleY} L ${520*scaleX} ${425*scaleY} L ${500*scaleX} ${458*scaleY} L ${473*scaleX} ${482*scaleY} L ${440*scaleX} ${498*scaleY} L ${403*scaleX} ${505*scaleY} L ${365*scaleX} ${502*scaleY} L ${330*scaleX} ${490*scaleY} L ${300*scaleX} ${470*scaleY} L ${278*scaleX} ${443*scaleY} L ${265*scaleX} ${410*scaleY} L ${260*scaleX} ${375*scaleY} L ${263*scaleX} ${340*scaleY} L ${273*scaleX} ${308*scaleY} L ${289*scaleX} ${280*scaleY} L ${310*scaleX} ${258*scaleY} L ${338*scaleX} ${248*scaleY} L ${276*scaleX} ${265*scaleY} Z`,
    // Australia outline
    `M ${870*scaleX} ${368*scaleY} L ${935*scaleX} ${355*scaleY} L ${980*scaleX} ${360*scaleY} L ${988*scaleX} ${388*scaleY} L ${975*scaleX} ${412*scaleY} L ${945*scaleX} ${428*scaleY} L ${905*scaleX} ${432*scaleY} L ${868*scaleX} ${425*scaleY} L ${840*scaleX} ${408*scaleY} L ${825*scaleX} ${383*scaleY} Z`,
  ]
  
  return (
    <g>
      {/* Bathymetry gradient background */}
      <defs>
        {/* Ocean depth gradient */}
        <radialGradient id="bathymetry" cx="50%" cy="40%">
          <stop offset="0%" stopColor="#0F1921" stopOpacity="1" />
          <stop offset="40%" stopColor="#0B0F12" stopOpacity="1" />
          <stop offset="100%" stopColor="#050709" stopOpacity="1" />
        </radialGradient>
        
        {/* Land texture pattern */}
        <pattern id="land-texture" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
          <circle cx="20" cy="20" r="1.5" fill="#1a2429" opacity="0.15" />
          <circle cx="50" cy="30" r="1" fill="#1a2429" opacity="0.1" />
          <circle cx="80" cy="20" r="1.5" fill="#1a2429" opacity="0.15" />
          <circle cx="30" cy="70" r="1" fill="#1a2429" opacity="0.1" />
          <circle cx="70" cy="60" r="1.5" fill="#1a2429" opacity="0.12" />
        </pattern>
        
        {/* Mountain shadows */}
        <linearGradient id="mountain-shadow" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0E151B" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#0E151B" stopOpacity="0" />
        </linearGradient>
      </defs>
      
      {/* Ocean base with bathymetry */}
      <rect width={width} height={height} fill="#0B0F12" />
      
      {/* Continents with physical styling */}
      {continents.map((path, index) => {
        return (
          <g key={`continent-${index}`}>
            {/* Base landmass - uniform color as per spec */}
            <path
              d={path}
              fill="#0E151B"
              fillOpacity="0.92"
              stroke="#223142"
              strokeWidth="0.75"
              strokeOpacity="0.7"
            />
            {/* Subtle texture overlay */}
            <path
              d={path}
              fill="url(#land-texture)"
              stroke="none"
              opacity="0.4"
            />
          </g>
        )
      })}
      
      {/* Subtle country boundaries */}
      <path
        d={`M ${520*scaleX} ${140*scaleY} L ${560*scaleX} ${110*scaleY} L ${610*scaleX} ${100*scaleY} L ${650*scaleX} ${110*scaleY} M ${650*scaleX} ${150*scaleY} L ${630*scaleX} ${180*scaleY} L ${600*scaleX} ${190*scaleY} L ${570*scaleX} ${175*scaleY}`}
        stroke="#1C2935"
        strokeWidth="0.5"
        strokeOpacity="0.3"
        fill="none"
        strokeDasharray="2,2"
      />
      
      {/* Graticule (latitude/longitude lines) */}
      <g stroke="#203040" strokeWidth="0.5" strokeDasharray="3,3" strokeOpacity="0.2" fill="none">
        {/* Latitude lines (20° intervals) */}
        {[-60, -40, -20, 0, 20, 40, 60].map((lat) => {
          const y = ((90 - lat) / 180) * height
          return <line key={`lat-${lat}`} x1="0" y1={y} x2={width} y2={y} />
        })}
        {/* Longitude lines (20° intervals) */}
        {[-180, -160, -140, -120, -100, -80, -60, -40, -20, 0, 20, 40, 60, 80, 100, 120, 140, 160, 180].map((lng) => {
          const x = ((lng + 180) / 360) * width
          return <line key={`lng-${lng}`} x1={x} y1="0" x2={x} y2={height} />
        })}
      </g>
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
  const [showBasemap, setShowBasemap] = useState(true)
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
        
        {/* World basemap layer */}
        <WorldBasemap
          width={dimensions.width}
          height={dimensions.height}
          showBasemap={showBasemap}
        />
        
        {/* Fallback grid background when basemap is hidden */}
        {!showBasemap && (
          <rect width="100%" height="100%" fill="url(#grid)" />
        )}
        
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
          variant={showBasemap ? "default" : "outline"}
          size="sm"
          onClick={() => setShowBasemap(!showBasemap)}
          className="bg-black/40 backdrop-blur-xl border-white/10 h-8 w-8 p-0"
          title="Toggle basemap"
        >
          <Globe className="w-4 h-4" />
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
