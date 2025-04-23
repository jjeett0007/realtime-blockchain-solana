"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DexTransactionsTable } from "@/components/tables/dex-transactions-table"
import { LiquidityPoolsTable } from "@/components/tables/liquidity-pools-table"
import { fetchDexTransactions, fetchLiquidityPools } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"

interface DexMonitoringPanelProps {
  apiKey: string
}

export default function DexMonitoringPanel({ apiKey }: DexMonitoringPanelProps) {
  const [loading, setLoading] = useState(true)
  const [transactions, setTransactions] = useState([])
  const [pools, setPools] = useState([])
  const [selectedDex, setSelectedDex] = useState("all")

  useEffect(() => {
    if (!apiKey) return

    const fetchData = async () => {
      setLoading(true)
      try {
        // In a real application, these would be actual API calls
        const txData = await fetchDexTransactions(apiKey, selectedDex)
        const poolsData = await fetchLiquidityPools(apiKey, selectedDex)

        setTransactions(txData)
        setPools(poolsData)
      } catch (error) {
        console.error("Error fetching DEX data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    // Set up polling for real-time updates
    const interval = setInterval(fetchData, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [apiKey, selectedDex])

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 sm:p-6 border-b gradient-bg">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">DEX Monitoring</h1>
          <p className="text-sm text-white/80">Track liquidity flows and swap activities</p>
        </div>
      </div>

      <div className="p-4 sm:p-6 flex-1 overflow-auto">
        <div className="flex justify-end mb-6">
          <Select value={selectedDex} onValueChange={setSelectedDex}>
            <SelectTrigger className="w-full sm:w-[180px] border-quaternary/20 focus:ring-quaternary">
              <SelectValue placeholder="Select DEX" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All DEXs</SelectItem>
              <SelectItem value="jupiter">Jupiter</SelectItem>
              <SelectItem value="orca">Orca</SelectItem>
              <SelectItem value="raydium">Raydium</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-6">
          <Card className="border-2 border-quaternary/20">
            <CardHeader className="px-3 sm:px-6">
              <CardTitle>24h Volume</CardTitle>
              <CardDescription>Trading volume in the last 24 hours</CardDescription>
            </CardHeader>
            <CardContent className="h-[180px] sm:h-[200px] px-3 sm:px-6">
              {loading ? (
                <Skeleton className="h-full w-full" />
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  Chart will be displayed here
                </div>
              )}
            </CardContent>
          </Card>
          <Card className="border-2 border-quaternary/20">
            <CardHeader className="px-3 sm:px-6">
              <CardTitle>Top Pairs</CardTitle>
              <CardDescription>Most active trading pairs</CardDescription>
            </CardHeader>
            <CardContent className="h-[180px] sm:h-[200px] px-3 sm:px-6">
              {loading ? (
                <Skeleton className="h-full w-full" />
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  Chart will be displayed here
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="transactions" className="mb-6">
          <TabsList className="bg-quaternary/10 dark:bg-quaternary/20 w-full">
            <TabsTrigger
              value="transactions"
              className="flex-1 data-[state=active]:bg-quaternary data-[state=active]:text-quaternary-foreground"
            >
              Recent Swaps
            </TabsTrigger>
            <TabsTrigger
              value="pools"
              className="flex-1 data-[state=active]:bg-quaternary data-[state=active]:text-quaternary-foreground"
            >
              Liquidity Pools
            </TabsTrigger>
          </TabsList>
          <TabsContent value="transactions">
            <Card>
              <CardHeader className="px-3 sm:px-6">
                <CardTitle>Recent DEX Transactions</CardTitle>
                <CardDescription>Latest swap transactions</CardDescription>
              </CardHeader>
              <CardContent className="px-0 sm:px-6 overflow-auto">
                <div className="overflow-x-auto">
                  {loading ? (
                    <div className="space-y-2 px-3 sm:px-0">
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  ) : (
                    <DexTransactionsTable transactions={transactions} />
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="pools">
            <Card>
              <CardHeader className="px-3 sm:px-6">
                <CardTitle>Liquidity Pools</CardTitle>
                <CardDescription>Current liquidity pools and their stats</CardDescription>
              </CardHeader>
              <CardContent className="px-0 sm:px-6 overflow-auto">
                <div className="overflow-x-auto">
                  {loading ? (
                    <div className="space-y-2 px-3 sm:px-0">
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  ) : (
                    <LiquidityPoolsTable pools={pools} />
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
