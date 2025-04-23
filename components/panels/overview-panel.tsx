"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RecentTransactionsTable } from "@/components/tables/recent-transactions-table"
import { SolanaStats } from "@/components/solana-stats"
import { AlertsList } from "@/components/alerts-list"
import { fetchSolanaStats, fetchRecentTransactions } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"
import { RefreshCw } from "lucide-react"

interface OverviewPanelProps {
  apiKey: string
}

export default function OverviewPanel({ apiKey }: OverviewPanelProps) {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [refreshCount, setRefreshCount] = useState(0)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  useEffect(() => {
    if (!apiKey) return

    const fetchData = async () => {
      setLoading(true)
      try {
        // Fetch real transaction data from the API
        const txData = await fetchRecentTransactions(apiKey)
        const statsData = await fetchSolanaStats(apiKey)

        setTransactions(txData)
        setStats(statsData)
        setLastUpdated(new Date())
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    // Set up polling for real-time updates
    // Transactions every 15 seconds
    const txInterval = setInterval(() => {
      setRefreshCount((prev) => prev + 1)
    }, 15000)

    // Price data every 5 minutes (300,000 ms)
    const priceInterval = setInterval(async () => {
      try {
        const statsData = await fetchSolanaStats(apiKey)
        setStats(statsData)
        setLastUpdated(new Date())
      } catch (error) {
        console.error("Error updating price data:", error)
      }
    }, 300000)

    return () => {
      clearInterval(txInterval)
      clearInterval(priceInterval)
    }
  }, [apiKey, refreshCount])

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 sm:p-6 border-b gradient-bg">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Dashboard Overview</h1>
          <p className="text-sm text-white/80">Real-time Solana blockchain monitoring</p>
        </div>
        {lastUpdated && (
          <div className="flex items-center text-white/80 text-xs">
            <RefreshCw className="h-3 w-3 mr-1" />
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
        )}
      </div>

      <div className="p-4 sm:p-6 flex-1 overflow-auto">
        <div className="grid gap-3 sm:gap-6 grid-cols-2 lg:grid-cols-4 mb-6">
          {loading && !stats ? (
            <>
              <Skeleton className="h-[120px] rounded-lg" />
              <Skeleton className="h-[120px] rounded-lg" />
              <Skeleton className="h-[120px] rounded-lg" />
              <Skeleton className="h-[120px] rounded-lg" />
            </>
          ) : (
            <SolanaStats stats={stats} />
          )}
        </div>

        <Tabs defaultValue="transactions" className="mb-6">
          <TabsList className="bg-primary/10 dark:bg-primary/20 w-full">
            <TabsTrigger
              value="transactions"
              className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Recent Transactions
            </TabsTrigger>
            <TabsTrigger
              value="alerts"
              className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Recent Alerts
            </TabsTrigger>
          </TabsList>
          <TabsContent value="transactions">
            <Card>
              <CardHeader className="px-3 sm:px-6">
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Latest transactions on the Solana blockchain</CardDescription>
              </CardHeader>
              <CardContent className="px-0 sm:px-6 overflow-auto">
                <div className="overflow-x-auto">
                  {loading && transactions.length === 0 ? (
                    <div className="space-y-2 px-3 sm:px-0">
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  ) : (
                    <RecentTransactionsTable transactions={transactions} isLoading={loading} />
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="alerts">
            <Card>
              <CardHeader className="px-3 sm:px-6">
                <CardTitle>Recent Alerts</CardTitle>
                <CardDescription>Notifications based on your alert configurations</CardDescription>
              </CardHeader>
              <CardContent className="px-3 sm:px-6">
                <AlertsList />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader className="px-3 sm:px-6">
              <CardTitle>Transaction Volume (24h)</CardTitle>
              <CardDescription>Transaction volume over the last 24 hours</CardDescription>
            </CardHeader>
            <CardContent className="h-[250px] sm:h-[300px] px-3 sm:px-6">
              {loading && !stats ? (
                <Skeleton className="h-full w-full" />
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  Chart will be displayed here
                </div>
              )}
            </CardContent>
          </Card>
          <Card className="mt-6 md:mt-0">
            <CardHeader className="px-3 sm:px-6">
              <CardTitle>Top Tokens (24h)</CardTitle>
              <CardDescription>Most active tokens by volume</CardDescription>
            </CardHeader>
            <CardContent className="h-[250px] sm:h-[300px] px-3 sm:px-6">
              {loading && !stats ? (
                <Skeleton className="h-full w-full" />
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  Chart will be displayed here
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
