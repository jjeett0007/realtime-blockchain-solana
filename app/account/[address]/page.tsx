"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  AlertCircle,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowUpDown,
  Copy,
  ExternalLink,
  Plus,
  RefreshCw,
  Search,
  Wallet,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"
import { fetchWalletPortfolio } from "@/lib/api"

// Update the API_KEY constant to ensure it's correct
const API_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjcmVhdGVkQXQiOjE3NDM1MDkzMTI1MjgsImVtYWlsIjoiamplZXR0MDAwMDdAZ21haWwuY29tIiwiYWN0aW9uIjoidG9rZW4tYXBpIiwiYXBpVmVyc2lvbiI6InYyIiwiaWF0IjoxNzQzNTA5MzEyfQ.GjtrzJmSbzbEJTjOw-N6kn6_o_7IjRcsg99Xc3Svz_8"

// DEX platform IDs
const DEX_PLATFORMS = {
  JUPITER: "JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4",
  RAYDIUM: "CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK",
  PUMPFUN: "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P",
  ORCA: "whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc",
}

export default function AccountPage() {
  const params = useParams()
  const router = useRouter()
  const address = params.address as string

  const [accountDetails, setAccountDetails] = useState<any>(null)
  const [tokenAccounts, setTokenAccounts] = useState<any[]>([])
  const [transfers, setTransfers] = useState<any[]>([])
  const [defiActivities, setDefiActivities] = useState<any[]>([])
  const [loading, setLoading] = useState({
    account: true,
    tokens: true,
    transfers: true,
    defi: true,
  })
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  // Update the fetchAccountDetails function similarly
  const fetchAccountDetails = async () => {
    setLoading((prev) => ({ ...prev, account: true }))
    try {
      const requestOptions = {
        method: "GET",
        headers: {
          token: API_KEY,
          "Content-Type": "application/json",
        },
      }

      try {
        const response = await fetch(
          `https://pro-api.solscan.io/v2.0/account/detail?address=${address}`,
          requestOptions,
        )

        if (!response.ok) {
          const errorText = await response.text()
          console.error(`API response error: ${response.status} - ${errorText}`)
          throw new Error(`API request failed with status ${response.status}`)
        }

        const data = await response.json()

        if (data.success) {
          setAccountDetails(data.data)
        } else {
          console.error("API returned success: false", data)
          setError("Failed to fetch account details. The account may not exist or the API may be unavailable.")
        }
      } catch (fetchError) {
        console.error("Fetch error in account details:", fetchError)
        setError("Failed to fetch account details. Please try again later.")
      }
    } catch (error) {
      console.error("Error fetching account details:", error)
      setError("Failed to fetch account details. Please try again later.")
    } finally {
      setLoading((prev) => ({ ...prev, account: false }))
    }
  }

  // Update the fetchTokenAccounts function similarly
  const fetchTokenAccounts = async () => {
    setLoading((prev) => ({ ...prev, tokens: true }))
    try {

      const portfolio = await fetchWalletPortfolio(address);

      console.log(portfolio);

      if (portfolio) {
        setTokenAccounts(portfolio);
      }
    } catch (error) {
      console.error("Error fetching token accounts:", error)
      setTokenAccounts([])
    } finally {
      setLoading((prev) => ({ ...prev, tokens: false }))
    }
  }

  // Update the fetchTransfers function to handle errors better and ensure proper headers
  const fetchTransfers = async () => {
    setLoading((prev) => ({ ...prev, transfers: true }))
    try {
      const requestOptions = {
        method: "GET",
        headers: {
          token: API_KEY,
          "Content-Type": "application/json",
        },
      }

      // Use a try-catch block to handle potential fetch errors
      try {
        const response = await fetch(
          `https://pro-api.solscan.io/v2.0/account/transfer?address=${address}&page=1&page_size=10&sort_by=block_time&sort_order=desc`,
          requestOptions,
        )

        if (!response.ok) {
          const errorText = await response.text()
          console.error(`API response error: ${response.status} - ${errorText}`)
          throw new Error(`API request failed with status ${response.status}`)
        }

        const data = await response.json()

        if (data.success) {
          setTransfers(data.data || [])
        } else {
          console.error("API returned success: false", data)
          // Use empty array instead of throwing error
          setTransfers([])
        }
      } catch (fetchError) {
        console.error("Fetch error in transfers:", fetchError)
        // Use empty array instead of throwing error
        setTransfers([])
      }
    } catch (error) {
      console.error("Error fetching transfers:", error)
      // Don't set error here to avoid overwhelming the user with error messages
      setTransfers([])
    } finally {
      setLoading((prev) => ({ ...prev, transfers: false }))
    }
  }

  // Similarly update the fetchDefiActivities function to handle errors better
  const fetchDefiActivities = async () => {
    setLoading((prev) => ({ ...prev, defi: true }))
    try {
      const requestOptions = {
        method: "GET",
        headers: {
          token: API_KEY,
          "Content-Type": "application/json",
        },
      }

      try {
        const response = await fetch(
          `https://pro-api.solscan.io/v2.0/account/defi/activities?address=${address}&page=1&page_size=10&sort_by=block_time&sort_order=desc`,
          requestOptions,
        )

        if (!response.ok) {
          const errorText = await response.text()
          console.error(`API response error: ${response.status} - ${errorText}`)
          throw new Error(`API request failed with status ${response.status}`)
        }

        const data = await response.json()

        if (data.success) {
          setDefiActivities(data.data || [])
        } else {
          console.error("API returned success: false", data)
          setDefiActivities([])
        }
      } catch (fetchError) {
        console.error("Fetch error in DeFi activities:", fetchError)
        setDefiActivities([])
      }
    } catch (error) {
      console.error("Error fetching DeFi activities:", error)
      setDefiActivities([])
    } finally {
      setLoading((prev) => ({ ...prev, defi: false }))
    }
  }

  // Update the fetchAllData function to handle errors better
  const fetchAllData = async () => {
    setError(null)

    // Execute all fetch operations in parallel but handle errors individually
    await Promise.allSettled([fetchAccountDetails(), fetchTokenAccounts(), fetchTransfers(), fetchDefiActivities()])

    setLastUpdated(new Date())
  }

  useEffect(() => {
    if (address) {
      fetchAllData()
    }
  }, [address])

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/account/${searchQuery.trim()}`)
    }
  }

  // Format SOL amount
  const formatSol = (lamports: number) => {
    return (lamports / 1000000000).toFixed(9) + " SOL"
  }

  // Format token amount
  const formatTokenAmount = (amount: number, decimals: number) => {
    return (amount / Math.pow(10, decimals)).toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: decimals > 6 ? 4 : 2,
    })
  }

  // Format address for display
  const formatAddress = (address: string, length = 6) => {
    if (!address) return ""
    if (address.length <= length * 2) return address
    return `${address.substring(0, length)}...${address.substring(address.length - length)}`
  }

  // Copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        console.log("Copied to clipboard")
      })
      .catch((err) => {
        console.error("Failed to copy: ", err)
      })
  }

  // Get platform name from ID
  const getPlatformName = (platformId: string) => {
    switch (platformId) {
      case DEX_PLATFORMS.JUPITER:
        return "Jupiter"
      case DEX_PLATFORMS.RAYDIUM:
        return "Raydium"
      case DEX_PLATFORMS.PUMPFUN:
        return "Pumpfun"
      case DEX_PLATFORMS.ORCA:
        return "Orca"
      default:
        return "Unknown"
    }
  }

  // Get activity type display name
  const getActivityTypeDisplay = (activityType: string) => {
    switch (activityType) {
      case "ACTIVITY_TOKEN_SWAP":
        return "Swap"
      case "ACTIVITY_TOKEN_ADD_LIQ":
        return "Add Liquidity"
      case "ACTIVITY_AGG_TOKEN_SWAP":
        return "Aggregated Swap"
      case "ACTIVITY_TOKEN_WITHDRAW_VAULT":
        return "Withdraw"
      case "ACTIVITY_TOKEN_DEPOSIT_VAULT":
        return "Deposit"
      default:
        return activityType.replace("ACTIVITY_", "").replace(/_/g, " ")
    }
  }

  // Get token name and icon from metadata
  const getTokenInfo = (tokenAddress: string, metadata: any) => {
    if (metadata?.tokens && metadata.tokens[tokenAddress]) {
      return {
        name: metadata.tokens[tokenAddress].token_symbol || formatAddress(tokenAddress),
        icon: metadata.tokens[tokenAddress].token_icon || null,
      }
    }
    return {
      name: formatAddress(tokenAddress),
      icon: null,
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex items-center justify-between p-4 sm:p-6 border-b gradient-bg">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Account Details</h1>
          <p className="text-sm text-white/80">View detailed information about this wallet</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            onClick={() => router.push("/")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Dashboard
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            onClick={fetchAllData}
            disabled={Object.values(loading).some(Boolean)}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${Object.values(loading).some(Boolean) ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      <div className="p-4 sm:p-6 flex-1">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 mb-6">
          <Input
            placeholder="Search by wallet address"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 border-primary/20 focus-visible:ring-primary"
          />
          <Button type="submit" className="bg-primary hover:bg-primary/90 w-full sm:w-auto">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </form>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Account Overview */}
        <Card className="mb-6">
          <CardHeader className="px-4 sm:px-6">
            <CardTitle className="flex items-center">
              <Wallet className="h-5 w-5 mr-2 text-primary" />
              Account Overview
            </CardTitle>
            <CardDescription>Basic information about this wallet</CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            {loading.account ? (
              <div className="space-y-4">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-8 w-1/2" />
              </div>
            ) : accountDetails ? (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Address</h3>
                    <div className="flex items-center mt-1">
                      <p className="font-mono text-sm break-all">{address}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-2 h-6 w-6 p-0"
                        onClick={() => copyToClipboard(address)}
                      >
                        <Copy className="h-3.5 w-3.5" />
                        <span className="sr-only">Copy address</span>
                      </Button>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <a
                      href={`https://solscan.io/account/${address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary"
                    >
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-3.5 w-3.5 mr-1" />
                        View on Solscan
                      </Button>
                    </a>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">SOL Balance</h3>
                    <p className="text-lg font-semibold mt-1">{formatSol(accountDetails.lamports)}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Account Type</h3>
                    <p className="mt-1">{accountDetails.type || "Unknown"}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Owner Program</h3>
                    <p className="font-mono text-sm mt-1">{formatAddress(accountDetails.owner_program, 8)}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground">No account details found.</div>
            )}
          </CardContent>
        </Card>

        {/* Tabs for Transfers and DeFi Activities */}
        <Tabs defaultValue="transfers" className="mb-6">
          <TabsList className="bg-primary/10 dark:bg-primary/20 w-full">
            <TabsTrigger
              value="transfers"
              className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Recent Transfers
            </TabsTrigger>
            <TabsTrigger
              value="defi"
              className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              DeFi Activities
            </TabsTrigger>
          </TabsList>

          {/* Transfers Tab */}
          <TabsContent value="transfers">
            <Card>
              <CardHeader className="px-4 sm:px-6">
                <CardTitle>Recent Transfers</CardTitle>
                <CardDescription>Recent token transfers involving this wallet</CardDescription>
              </CardHeader>
              <CardContent className="px-0 sm:px-6 overflow-auto">
                <div className="overflow-x-auto">
                  {loading.transfers ? (
                    <div className="space-y-2 px-4 sm:px-0">
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  ) : transfers.length === 0 ? (
                    <div className="text-center py-4 text-muted-foreground px-4 sm:px-0">
                      No transfers found for this wallet.
                    </div>
                  ) : (
                    <Table className="min-w-[800px]">
                      <TableHeader>
                        <TableRow>
                          <TableHead>Transaction</TableHead>
                          <TableHead>Time</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>From/To</TableHead>
                          <TableHead>Value (USD)</TableHead>
                          <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {transfers.map((transfer, index) => {
                          const isOutgoing = transfer.flow === "out"
                          const tokenInfo = getTokenInfo(transfer.token_address, transfer.metadata)
                          const formattedAmount = formatTokenAmount(transfer.amount, transfer.token_decimals)
                          const counterpartyAddress = isOutgoing ? transfer.to_address : transfer.from_address

                          return (
                            <TableRow key={`${transfer.trans_id}-${index}`}>
                              <TableCell className="font-mono text-xs">
                                <Link href={`/tx/${transfer.trans_id}`} className="hover:text-primary hover:underline">
                                  {formatAddress(transfer.trans_id, 8)}
                                </Link>
                              </TableCell>
                              <TableCell className="text-xs">
                                {formatDistanceToNow(new Date(transfer.time), { addSuffix: true })}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={isOutgoing ? "destructive" : "success"}
                                  className="flex items-center gap-1"
                                >
                                  {isOutgoing ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                                  {isOutgoing ? "Out" : "In"}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1">
                                  {tokenInfo.icon && (
                                    <div className="w-4 h-4 relative">
                                      <img
                                        src={tokenInfo.icon || "/placeholder.svg"}
                                        alt={tokenInfo.name}
                                        className="w-full h-full object-contain"
                                        onError={(e) => {
                                          ; (e.target as HTMLImageElement).style.display = "none"
                                        }}
                                      />
                                    </div>
                                  )}
                                  <span>
                                    {formattedAmount} {tokenInfo.name}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell className="font-mono text-xs">
                                <div className="flex items-center gap-1">
                                  {isOutgoing ? (
                                    <ArrowRight className="h-3 w-3 text-muted-foreground" />
                                  ) : (
                                    <ArrowLeft className="h-3 w-3 text-muted-foreground" />
                                  )}
                                  <Link
                                    href={`/account/${counterpartyAddress}`}
                                    className="hover:text-primary hover:underline"
                                  >
                                    {formatAddress(counterpartyAddress, 8)}
                                  </Link>
                                </div>
                              </TableCell>
                              <TableCell>${transfer.value ? Number(transfer.value).toLocaleString() : "N/A"}</TableCell>
                              <TableCell>
                                <a
                                  href={`/tx/${transfer.trans_id}`}
                                  rel="noopener noreferrer"
                                  className="text-muted-foreground hover:text-primary"
                                >
                                  <ExternalLink className="h-4 w-4" />
                                  <span className="sr-only">View on Solscan</span>
                                </a>
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* DeFi Activities Tab */}
          <TabsContent value="defi">
            <Card>
              <CardHeader className="px-4 sm:px-6">
                <CardTitle>DeFi Activities</CardTitle>
                <CardDescription>Recent DeFi interactions from this wallet</CardDescription>
              </CardHeader>
              <CardContent className="px-0 sm:px-6 overflow-auto">
                <div className="overflow-x-auto">
                  {loading.defi ? (
                    <div className="space-y-2 px-4 sm:px-0">
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  ) : defiActivities.length === 0 ? (
                    <div className="text-center py-4 text-muted-foreground px-4 sm:px-0">
                      No DeFi activities found for this wallet.
                    </div>
                  ) : (
                    <Table className="min-w-[800px]">
                      <TableHeader>
                        <TableRow>
                          <TableHead>Transaction</TableHead>
                          <TableHead>Time</TableHead>
                          <TableHead>Platform</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Details</TableHead>
                          <TableHead>Value (USD)</TableHead>
                          <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {defiActivities.map((activity, index) => {
                          const platform = Array.isArray(activity.platform) ? activity.platform[0] : activity.platform
                          const platformName = getPlatformName(platform)
                          const activityType = getActivityTypeDisplay(activity.activity_type)

                          // Extract token details if available
                          let details = "N/A"
                          if (activity.routers) {
                            const token1Info = getTokenInfo(activity.routers.token1, activity.metadata)

                            if (activity.routers.token2) {
                              // Swap activity
                              const token2Info = getTokenInfo(activity.routers.token2, activity.metadata)
                              const amount1 = formatTokenAmount(
                                activity.routers.amount1,
                                activity.routers.token1_decimals,
                              )
                              const amount2 = formatTokenAmount(
                                activity.routers.amount2,
                                activity.routers.token2_decimals,
                              )
                              details = `${amount1} ${token1Info.name} → ${amount2} ${token2Info.name}`
                            } else {
                              // Deposit/Withdraw activity
                              const amount1 = formatTokenAmount(
                                activity.routers.amount1,
                                activity.routers.token1_decimals,
                              )
                              details = `${amount1} ${token1Info.name}`
                            }
                          }

                          return (
                            <TableRow key={`${activity.trans_id}-${activity.activity_type}-${index}`}>
                              <TableCell className="font-mono text-xs">
                                <Link href={`/tx/${activity.trans_id}`} className="hover:text-primary hover:underline">
                                  {formatAddress(activity.trans_id, 8)}
                                </Link>
                              </TableCell>
                              <TableCell className="text-xs">
                                {formatDistanceToNow(new Date(activity.time), { addSuffix: true })}
                              </TableCell>
                              <TableCell>{platformName}</TableCell>
                              <TableCell>
                                <Badge variant="outline" className="bg-secondary/10 text-secondary">
                                  {activity.activity_type.includes("SWAP") ? (
                                    <ArrowUpDown className="h-3 w-3 mr-1" />
                                  ) : activity.activity_type.includes("ADD_LIQ") ? (
                                    <Plus className="h-3 w-3 mr-1" />
                                  ) : activity.activity_type.includes("DEPOSIT") ? (
                                    <ArrowDown className="h-3 w-3 mr-1" />
                                  ) : activity.activity_type.includes("WITHDRAW") ? (
                                    <ArrowUp className="h-3 w-3 mr-1" />
                                  ) : null}
                                  {activityType}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-xs max-w-[250px] truncate">{details}</TableCell>
                              <TableCell>${activity.value ? Number(activity.value).toLocaleString() : "N/A"}</TableCell>
                              <TableCell>
                                <Link
                                  href={`/tx/${activity.trans_id}`}
                                  className="text-muted-foreground hover:text-primary"
                                >
                                  <ExternalLink className="h-4 w-4" />
                                  <span className="sr-only">View Transaction Details</span>
                                </Link>
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Token Accounts */}
        <Card className="mb-6">
          <CardHeader className="px-4 sm:px-6">
            <CardTitle>Token Accounts</CardTitle>
            <CardDescription>Tokens held by this wallet</CardDescription>
          </CardHeader>
          <CardContent className="px-0 sm:px-6 overflow-auto">
            <div className="overflow-x-auto">
              {loading.tokens ? (
                <div className="space-y-2 px-4 sm:px-0">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : tokenAccounts.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground px-4 sm:px-0">
                  No token accounts found for this wallet.
                </div>
              ) : (
                <Table className="min-w-[600px]">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Token</TableHead>
                      <TableHead>Balance</TableHead>
                      <TableHead>Value (USD)</TableHead>
                      <TableHead>Token Account</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tokenAccounts.map((account, index) => {
                      const tokenInfo = getTokenInfo(account.token_address, { tokens: account.metadata?.tokens })
                      return (
                        <TableRow key={index}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-5 h-5 relative">
                                <img
                                  src={account.icon || "/placeholder.svg"}
                                  alt={account.name}
                                  className="w-full h-full object-contain"
                                  onError={(e) => {
                                    ; (e.target as HTMLImageElement).style.display = "none"
                                  }}
                                />
                              </div>
                              <span>{account.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>{account.amount}</div>
                          </TableCell>
                          <TableCell>
                            <div>{account.value}</div>
                          </TableCell>
                          <TableCell className="font-mono text-xs">{formatAddress(account.id, 8)}</TableCell>
                          <TableCell>
                            <a
                              href={`https://solscan.io/token/${account.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-muted-foreground hover:text-primary"
                            >
                              <ExternalLink className="h-4 w-4" />
                              <span className="sr-only">View Token</span>
                            </a>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              )}
            </div>
          </CardContent>
        </Card>



        {lastUpdated && (
          <div className="flex justify-end items-center text-muted-foreground text-xs">
            <RefreshCw className="h-3 w-3 mr-1" />
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
        )}
      </div>
    </div>
  )
}
