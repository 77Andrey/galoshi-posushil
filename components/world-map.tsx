"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { tradeRoutes, chokepoints } from "@/lib/mock-data"

interface WorldMapProps {
  selectedRoute?: string | null
  onRouteSelect?: (routeId: string | null) => void
}

// Simple SVG map projection (Equirectangular for simplicity - no external libraries)
const latLngToXY = (lat: number, lng: number, width: number, height: number) => {
  const x = ((lng + 180) / 360) * width
  const y = ((90 - lat) / 180) * height
      return { x, y }
    }

// Generate world map SVG paths (simplified continents)
const generateWorldPaths = () => {
  // This is a simplified representation - in production you'd use GeoJSON data
  // For now, we'll draw a simple grid background
  return null
}

// Animated arc component
const AnimatedArc = ({
  from,
  to,
  width,
  height,
  isSelected,
  risk,
  status,
}: {
  from: { lat: number; lng: number }
  to: { lat: number; lng: number }
  width: number
  height: number
  isSelected: boolean
  risk: string
  status: string
}) => {
  const origin = latLngToXY(from.lat, from.lng, width, height)
  const destination = latLngToXY(to.lat, to.lng, width, height)

      // Calculate control point for curved line
      const midX = (origin.x + destination.x) / 2
      const midY = (origin.y + destination.y) / 2
      const dx = destination.x - origin.x
      const dy = destination.y - origin.y
      const curvature = 0.2
      const controlX = midX - dy * curvature
      const controlY = midY + dx * curvature

      // Route color based on risk
      const colors = {
        low: "rgba(100, 255, 150, 0.6)",
        medium: "rgba(255, 200, 100, 0.6)",
        high: "rgba(255, 150, 100, 0.6)",
        critical: "rgba(255, 100, 100, 0.8)",
      }

  const strokeColor = isSelected ? "rgba(150, 200, 255, 1)" : colors[risk as keyof typeof colors]
  const strokeWidth = isSelected ? 3 : status === "disrupted" ? 2 : 1.5
  
  const [animationProgress, setAnimationProgress] = useState(0)
  
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationProgress((prev) => (prev + 0.02) % 1)
    }, 16) // ~60fps
    return () => clearInterval(interval)
  }, [])
  
  // Calculate particle position along curve
  const t = animationProgress
        const particleX = Math.pow(1 - t, 2) * origin.x + 2 * (1 - t) * t * controlX + Math.pow(t, 2) * destination.x
        const particleY = Math.pow(1 - t, 2) * origin.y + 2 * (1 - t) * t * controlY + Math.pow(t, 2) * destination.y

  // For disrupted routes, use dashed line
  const strokeDasharray = status === "disrupted" ? "10,5" : undefined
  
  return (
    <g>
      {/* Route arc */}
      <path
        d={`M ${origin.x} ${origin.y} Q ${controlX} ${controlY} ${destination.x} ${destination.y}`}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={strokeDasharray}
        opacity={isSelected ? 1 : 0.7}
      />
      
      {/* Animated flow particle for active routes */}
      {(status === "active" || isSelected) && (
        <circle
          cx={particleX}
          cy={particleY}
          r={isSelected ? 4 : 3}
          fill={strokeColor}
          opacity={isSelected ? 0.9 : 0.6}
        />
      )}
    </g>
  )
}

export function WorldMap({ selectedRoute, onRouteSelect }: WorldMapProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [hoveredPoint, setHoveredPoint] = useState<string | null>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  
  useEffect(() => {
    const updateDimensions = () => {
      if (svgRef.current?.parentElement) {
        const parent = svgRef.current.parentElement
        setDimensions({
          width: parent.clientWidth,
          height: parent.clientHeight,
        })
      }
    }
    
    updateDimensions()
    window.addEventListener("resize", updateDimensions)
    return () => window.removeEventListener("resize", updateDimensions)
  }, [])
  
  const handleSvgClick = (e: React.MouseEvent<SVGElement>) => {
    // Check if clicked on a route endpoint
    const target = e.target as SVGElement
    const routeId = target.getAttribute("data-route-id")
    onRouteSelect?.(routeId || null)
  }
  
  const handlePointMouseMove = (pointId: string) => {
    setHoveredPoint(pointId)
  }
  
  return (
    <div className="relative w-full h-full bg-background/50 rounded-lg overflow-hidden">
      <svg
        ref={svgRef}
        width={dimensions.width || "100%"}
        height={dimensions.height || "100%"}
        className="cursor-crosshair"
        viewBox={`0 0 ${dimensions.width || 1000} ${dimensions.height || 600}`}
        preserveAspectRatio="none"
        onClick={handleSvgClick}
      >
        {/* Grid background */}
        <defs>
          <pattern id="grid" width="60" height="40" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="60" y2="0" stroke="rgba(100, 150, 255, 0.1)" strokeWidth="0.5" />
            <line x1="0" y1="0" x2="0" y2="40" stroke="rgba(100, 150, 255, 0.1)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        
        {/* Latitude and longitude lines */}
        <g opacity={0.2}>
          {[-60, -30, 0, 30, 60].map((lat) => {
            const y = ((90 - lat) / 180) * dimensions.height
            return (
              <line
                key={`lat-${lat}`}
                x1={0}
                y1={y}
                x2={dimensions.width}
                y2={y}
                stroke="rgba(100, 150, 255, 0.2)"
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
                y1={0}
                x2={x}
                y2={dimensions.height}
                stroke="rgba(100, 150, 255, 0.2)"
                strokeWidth="1"
                strokeDasharray="5,5"
              />
            )
          })}
        </g>
        
        {/* Trade routes */}
        {dimensions.width > 0 && tradeRoutes.map((route) => (
          <AnimatedArc
            key={route.id}
            from={route.origin}
            to={route.destination}
            width={dimensions.width}
            height={dimensions.height}
            isSelected={selectedRoute === route.id}
            risk={route.risk}
            status={route.status}
          />
        ))}
        
        {/* Chokepoints */}
        {dimensions.width > 0 && chokepoints.map((point) => {
          const pos = latLngToXY(point.lat, point.lng, dimensions.width, dimensions.height)
      const isHovered = hoveredPoint === point.id

      const colors = {
        low: "rgba(100, 255, 150, 0.8)",
        medium: "rgba(255, 200, 100, 0.8)",
        high: "rgba(255, 150, 100, 0.8)",
        critical: "rgba(255, 100, 100, 1)",
      }

          return (
            <g
              key={point.id}
              onMouseEnter={() => handlePointMouseMove(point.id)}
              onMouseLeave={() => setHoveredPoint(null)}
            >
              {/* Glow effect for critical/hovered points */}
              {(point.riskLevel === "critical" || isHovered) && (
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={isHovered ? 12 : 10}
                  fill={colors[point.riskLevel as keyof typeof colors]}
                  opacity={0.3}
                  style={{ filter: "blur(8px)" }}
                />
              )}
              
              {/* Chokepoint marker */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r={isHovered ? 8 : 6}
                fill={colors[point.riskLevel as keyof typeof colors]}
              />
              
              {/* Chokepoint icon */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r={isHovered ? 10 : 8}
                fill="none"
                stroke="rgba(255, 255, 255, 0.9)"
                strokeWidth="1.5"
              />
              
              {/* Invisible clickable area */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r="15"
                fill="transparent"
                cursor="pointer"
              />
            </g>
          )
        })}
        
        {/* Route endpoints for click detection */}
        {dimensions.width > 0 && tradeRoutes.map((route) => {
          const origin = latLngToXY(route.origin.lat, route.origin.lng, dimensions.width, dimensions.height)
          const destination = latLngToXY(route.destination.lat, route.destination.lng, dimensions.width, dimensions.height)

  return (
            <g key={`points-${route.id}`}>
              <circle
                cx={origin.x}
                cy={origin.y}
                r="20"
                fill="transparent"
                data-route-id={route.id}
                cursor="pointer"
              />
              <circle
                cx={destination.x}
                cy={destination.y}
                r="20"
                fill="transparent"
                data-route-id={route.id}
                cursor="pointer"
              />
            </g>
          )
        })}
      </svg>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 glass-panel p-3 rounded-lg space-y-2">
        <div className="text-xs font-semibold text-foreground mb-2">Risk Levels</div>
        <div className="flex items-center gap-2 text-xs">
          <div className="w-3 h-3 rounded-full bg-[rgba(100,255,150,0.8)]" />
          <span className="text-muted-foreground">Low</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div className="w-3 h-3 rounded-full bg-[rgba(255,200,100,0.8)]" />
          <span className="text-muted-foreground">Medium</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div className="w-3 h-3 rounded-full bg-[rgba(255,150,100,0.8)]" />
          <span className="text-muted-foreground">High</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div className="w-3 h-3 rounded-full bg-[rgba(255,100,100,1)]" />
          <span className="text-muted-foreground">Critical</span>
        </div>
      </div>

      {/* Chokepoint tooltip */}
      {hoveredPoint && dimensions.width > 0 && (
        <div className="absolute top-4 right-4 glass-panel p-3 rounded-lg max-w-xs">
          {chokepoints.find((cp) => cp.id === hoveredPoint) && (
            <>
              <div className="font-semibold text-sm text-foreground">
                {chokepoints.find((cp) => cp.id === hoveredPoint)?.name}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {chokepoints.find((cp) => cp.id === hoveredPoint)?.throughput}% of global trade
              </div>
              <div className="text-xs text-muted-foreground">
                {chokepoints.find((cp) => cp.id === hoveredPoint)?.recentIncidents} recent incidents
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}