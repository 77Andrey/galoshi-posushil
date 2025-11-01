"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { tradeRoutes, chokepoints } from "@/lib/mock-data"

interface WorldMapProps {
  selectedRoute?: string | null
  onRouteSelect?: (routeId: string | null) => void
}

export function WorldMap({ selectedRoute, onRouteSelect }: WorldMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [hoveredPoint, setHoveredPoint] = useState<string | null>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const updateDimensions = () => {
      if (canvasRef.current?.parentElement) {
        const parent = canvasRef.current.parentElement
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

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || dimensions.width === 0) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas resolution
    const dpr = window.devicePixelRatio || 1
    canvas.width = dimensions.width * dpr
    canvas.height = dimensions.height * dpr
    ctx.scale(dpr, dpr)

    // Clear canvas
    ctx.clearRect(0, 0, dimensions.width, dimensions.height)

    // Convert lat/lng to canvas coordinates
    const latLngToXY = (lat: number, lng: number) => {
      const x = ((lng + 180) / 360) * dimensions.width
      const y = ((90 - lat) / 180) * dimensions.height
      return { x, y }
    }

    // Draw world map outline (simplified continents)
    ctx.strokeStyle = "rgba(100, 150, 255, 0.2)"
    ctx.lineWidth = 1
    ctx.setLineDash([5, 5])

    // Draw latitude lines
    for (let lat = -60; lat <= 60; lat += 30) {
      ctx.beginPath()
      const start = latLngToXY(lat, -180)
      const end = latLngToXY(lat, 180)
      ctx.moveTo(start.x, start.y)
      ctx.lineTo(end.x, end.y)
      ctx.stroke()
    }

    // Draw longitude lines
    for (let lng = -180; lng <= 180; lng += 60) {
      ctx.beginPath()
      const start = latLngToXY(-60, lng)
      const end = latLngToXY(60, lng)
      ctx.moveTo(start.x, start.y)
      ctx.lineTo(end.x, end.y)
      ctx.stroke()
    }

    ctx.setLineDash([])

    // Draw trade routes
    tradeRoutes.forEach((route) => {
      const isSelected = selectedRoute === route.id
      const origin = latLngToXY(route.origin.lat, route.origin.lng)
      const destination = latLngToXY(route.destination.lat, route.destination.lng)

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

      ctx.strokeStyle = isSelected ? "rgba(150, 200, 255, 1)" : colors[route.risk]
      ctx.lineWidth = isSelected ? 3 : route.status === "disrupted" ? 2 : 1.5

      if (route.status === "disrupted") {
        ctx.setLineDash([10, 5])
      }

      // Draw curved route
      ctx.beginPath()
      ctx.moveTo(origin.x, origin.y)
      ctx.quadraticCurveTo(controlX, controlY, destination.x, destination.y)
      ctx.stroke()
      ctx.setLineDash([])

      // Draw animated flow particles for active routes
      if (route.status === "active" || isSelected) {
        const t = (Date.now() % 3000) / 3000
        const particleX = Math.pow(1 - t, 2) * origin.x + 2 * (1 - t) * t * controlX + Math.pow(t, 2) * destination.x
        const particleY = Math.pow(1 - t, 2) * origin.y + 2 * (1 - t) * t * controlY + Math.pow(t, 2) * destination.y

        ctx.fillStyle = isSelected ? "rgba(150, 200, 255, 0.9)" : colors[route.risk]
        ctx.beginPath()
        ctx.arc(particleX, particleY, isSelected ? 4 : 3, 0, Math.PI * 2)
        ctx.fill()
      }
    })

    // Draw chokepoints
    chokepoints.forEach((point) => {
      const pos = latLngToXY(point.lat, point.lng)
      const isHovered = hoveredPoint === point.id

      const colors = {
        low: "rgba(100, 255, 150, 0.8)",
        medium: "rgba(255, 200, 100, 0.8)",
        high: "rgba(255, 150, 100, 0.8)",
        critical: "rgba(255, 100, 100, 1)",
      }

      // Draw glow effect for critical points
      if (point.riskLevel === "critical" || isHovered) {
        ctx.shadowBlur = 15
        ctx.shadowColor = colors[point.riskLevel]
      }

      ctx.fillStyle = colors[point.riskLevel]
      ctx.beginPath()
      ctx.arc(pos.x, pos.y, isHovered ? 8 : 6, 0, Math.PI * 2)
      ctx.fill()

      ctx.shadowBlur = 0

      // Draw chokepoint icon
      ctx.strokeStyle = "rgba(255, 255, 255, 0.9)"
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.arc(pos.x, pos.y, isHovered ? 10 : 8, 0, Math.PI * 2)
      ctx.stroke()
    })

    // Request animation frame for particle animation
    const animationId = requestAnimationFrame(() => {
      // Trigger re-render for animation
      setDimensions((prev) => ({ ...prev }))
    })

    return () => cancelAnimationFrame(animationId)
  }, [dimensions, selectedRoute, hoveredPoint])

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Check if clicked on a route (simplified - check endpoints)
    const latLngToXY = (lat: number, lng: number) => {
      const canvasX = ((lng + 180) / 360) * dimensions.width
      const canvasY = ((90 - lat) / 180) * dimensions.height
      return { x: canvasX, y: canvasY }
    }

    let clickedRoute: string | null = null
    tradeRoutes.forEach((route) => {
      const origin = latLngToXY(route.origin.lat, route.origin.lng)
      const destination = latLngToXY(route.destination.lat, route.destination.lng)

      const distToOrigin = Math.sqrt(Math.pow(x - origin.x, 2) + Math.pow(y - origin.y, 2))
      const distToDest = Math.sqrt(Math.pow(x - destination.x, 2) + Math.pow(y - destination.y, 2))

      if (distToOrigin < 20 || distToDest < 20) {
        clickedRoute = route.id
      }
    })

    onRouteSelect?.(clickedRoute)
  }

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const latLngToXY = (lat: number, lng: number) => {
      const canvasX = ((lng + 180) / 360) * dimensions.width
      const canvasY = ((90 - lat) / 180) * dimensions.height
      return { x: canvasX, y: canvasY }
    }

    let hoveredId: string | null = null
    chokepoints.forEach((point) => {
      const pos = latLngToXY(point.lat, point.lng)
      const dist = Math.sqrt(Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2))

      if (dist < 15) {
        hoveredId = point.id
      }
    })

    setHoveredPoint(hoveredId)
  }

  return (
    <div className="relative w-full h-full bg-background/50 rounded-lg overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-crosshair"
        style={{ width: "100%", height: "100%" }}
        onClick={handleCanvasClick}
        onMouseMove={handleCanvasMouseMove}
      />

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
      {hoveredPoint && (
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
