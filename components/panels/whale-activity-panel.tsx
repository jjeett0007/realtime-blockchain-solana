"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WhaleTransactionsTable } from "@/components/tables/whale-transactions-table"
import { WhaleWalletsTable } from "@/components/tables/whale-wallets-table"
import { fetchWhaleTransactions, fetchWhaleWallets, TOKEN_ADDRESSES } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, RefreshCw, Search } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { WhaleTransactionVolumeChart } from "@/components/charts/whale-transaction-volume-chart"

interface WhaleActivityPanelProps {
  apiKey: string
}

export default function WhaleActivityPanel({ apiKey }: WhaleActivityPanelProps) {
  const [loading, setLoading] = useState(true)
  const [transactions, setTransactions] = useState([])
  const [wallets, setWallets] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedToken, setSelectedToken] = useState("all") // Default to "all" tokens
  const [refreshCount, setRefreshCount] = useState(0)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [allTransactions, setAllTransactions] = useState([]) // Store all transactions for chart

  useEffect(() => {
    if (!apiKey) return

    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        // Fetch whale transactions for the selected token
        const txData = await fetchWhaleTransactions(apiKey, selectedToken)
        const walletsData = await fetchWhaleWallets(apiKey)

        setTransactions(txData)

        // Add new transactions to allTransactions without duplicates
        setAllTransactions((prevAll) => {
          const existingIds = new Set(prevAll.map((tx: any) => tx.id))
          const newTxs = txData.filter((tx: any) => !existingIds.has(tx.id))
          return [...prevAll, ...newTxs]
        })

        setWallets(walletsData)
        setLastUpdated(new Date())
      } catch (error) {
        console.error("Error fetching whale data:", error)
        setError("Failed to fetch whale activity data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    // Set up polling for real-time updates every 30 seconds
    const interval = setInterval(() => {
      setRefreshCount((prev) => prev + 1)
    }, 30000)

    return () => clearInterval(interval)
  }, [apiKey, selectedToken, refreshCount])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would trigger a search API call
    console.log("Searching for:", searchQuery)
  }

  const handleTokenChange = (value: string) => {
    setSelectedToken(value)
  }

  // Get token name for display
  const getTokenName = (tokenAddress: string) => {
    switch (tokenAddress) {
      case TOKEN_ADDRESSES.SOL:
        return "SOL"
      case TOKEN_ADDRESSES.USDC:
        return "USDC"
      case TOKEN_ADDRESSES.USDT:
        return "USDT"
      default:
        return "All Tokens"
    }
  }

  // Calculate minimum threshold based on token
  const getThresholdText = (tokenAddress: string) => {
    switch (tokenAddress) {
      case TOKEN_ADDRESSES.SOL:
        return "10,000,000 SOL"
      case TOKEN_ADDRESSES.USDC:
        return "100,000 USDC"
      case TOKEN_ADDRESSES.USDT:
        return "10,000,000 USDT"
      default:
        return "threshold amounts"
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 sm:p-6 border-b gradient-bg">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Whale Activity</h1>
          <p className="text-sm text-white/80">Track large transactions and whale wallet movements</p>
        </div>
        {lastUpdated && (
          <div className="flex items-center text-white/80 text-xs">
            <RefreshCw className="h-3 w-3 mr-1" />
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
        )}
      </div>

      <div className="p-4 sm:p-6 flex-1 overflow-auto">
        <div className="flex flex-col sm:flex-row gap-2 mb-6 justify-between">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 flex-1">
            <Input
              placeholder="Search by wallet address or transaction hash"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 border-secondary/20 focus-visible:ring-secondary"
            />
            <Button type="submit" className="bg-secondary hover:bg-secondary/90 w-full sm:w-auto">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </form>

          <Select value={selectedToken} onValueChange={handleTokenChange}>
            <SelectTrigger className="w-full sm:w-[180px] border-tertiary/20 focus:ring-tertiary">
              <SelectValue placeholder="Select Token" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tokens</SelectItem>
              <SelectItem value={TOKEN_ADDRESSES.SOL}>SOL</SelectItem>
              <SelectItem value={TOKEN_ADDRESSES.USDC}>USDC</SelectItem>
              <SelectItem value={TOKEN_ADDRESSES.USDT}>USDT</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card className="mb-6 border-2 border-tertiary/20">
          <CardHeader className="px-3 sm:px-6">
            <CardTitle>
              {selectedToken === "all"
                ? "Whale Transaction Volume (24h)"
                : `${getTokenName(selectedToken)} Whale Transaction Volume (24h)`}
            </CardTitle>
            <CardDescription>
              {selectedToken === "all"
                ? "Large transactions across USDC and USDT"
                : `Transactions over ${getThresholdText(selectedToken)} in the last 24 hours`}
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[250px] sm:h-[300px] px-3 sm:px-6">
            <WhaleTransactionVolumeChart
              transactions={allTransactions}
              selectedToken={selectedToken}
              isLoading={loading}
            />
          </CardContent>
        </Card>

        <Tabs defaultValue="transactions" className="mb-6">
          <TabsList className="bg-tertiary/10 dark:bg-tertiary/20 w-full">
            <TabsTrigger
              value="transactions"
              className="flex-1 data-[state=active]:bg-tertiary data-[state=active]:text-tertiary-foreground"
            >
              Whale Transactions
            </TabsTrigger>
            <TabsTrigger
              value="wallets"
              className="flex-1 data-[state=active]:bg-tertiary data-[state=active]:text-tertiary-foreground"
            >
              Whale Wallets
            </TabsTrigger>
          </TabsList>
          <TabsContent value="transactions">
            <Card>
              <CardHeader className="px-3 sm:px-6">
                <CardTitle>
                  {selectedToken === "all"
                    ? "Recent Whale Transactions"
                    : `Recent ${getTokenName(selectedToken)} Whale Transactions`}
                </CardTitle>
                <CardDescription>
                  {selectedToken === "all"
                    ? "Large transactions across USDC and USDT"
                    : `Large ${getTokenName(selectedToken)} transactions over ${getThresholdText(selectedToken)}`}
                </CardDescription>
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
                    <WhaleTransactionsTable transactions={transactions} isLoading={loading} />
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="wallets">
            <Card>
              <CardHeader className="px-3 sm:px-6">
                <CardTitle>Top Whale Wallets</CardTitle>
                <CardDescription>Wallets with the largest holdings</CardDescription>
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
                    <WhaleWalletsTable wallets={wallets} />
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
