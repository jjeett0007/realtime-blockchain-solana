"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDown, ArrowUp, BarChart2, Clock, Coins } from "lucide-react"

interface SolanaStatsProps {
  stats: any
}

export function SolanaStats({ stats }: SolanaStatsProps) {
  // If no stats, show placeholder data
  const data = stats || {
    price: 100.25,
    priceChange: 2.5,
    tps: 2500,
    blockTime: 0.4,
    marketCap: 42.5,
  }

  const isPriceUp = data.priceChange > 0

  return (
    <>
      <Card className="border-2 border-secondary/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6">
          <CardTitle className="text-xs sm:text-sm font-medium">SOL Price</CardTitle>
          <Coins className="h-4 w-4 text-secondary" />
        </CardHeader>
        <CardContent className="px-3 sm:px-6">
          <div className="text-xl sm:text-2xl font-bold">${data.price.toFixed(2)}</div>
          <p className={`text-xs flex items-center ${isPriceUp ? "text-success" : "text-destructive"}`}>
            {isPriceUp ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
            {Math.abs(data.priceChange).toFixed(2)}% from yesterday
          </p>
        </CardContent>
      </Card>

      <Card className="border-2 border-primary/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6">
          <CardTitle className="text-xs sm:text-sm font-medium">TPS</CardTitle>
          <BarChart2 className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent className="px-3 sm:px-6">
          <div className="text-xl sm:text-2xl font-bold">{data.tps}</div>
          <p className="text-xs text-muted-foreground">Transactions per second</p>
        </CardContent>
      </Card>

      <Card className="border-2 border-tertiary/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6">
          <CardTitle className="text-xs sm:text-sm font-medium">Block Time</CardTitle>
          <Clock className="h-4 w-4 text-tertiary" />
        </CardHeader>
        <CardContent className="px-3 sm:px-6">
          <div className="text-xl sm:text-2xl font-bold">{data.blockTime}s</div>
          <p className="text-xs text-muted-foreground">Average block time</p>
        </CardContent>
      </Card>

      <Card className="border-2 border-quaternary/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6">
          <CardTitle className="text-xs sm:text-sm font-medium">Market Cap</CardTitle>
          <Coins className="h-4 w-4 text-quaternary" />
        </CardHeader>
        <CardContent className="px-3 sm:px-6">
          <div className="text-xl sm:text-2xl font-bold">${data.marketCap}B</div>
          <p className="text-xs text-muted-foreground">Total market capitalization</p>
        </CardContent>
      </Card>
    </>
  )
}
