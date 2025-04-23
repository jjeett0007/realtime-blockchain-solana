"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, AlertCircle, RefreshCw, ArrowUpDown, Plus, ExternalLink } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"

// DEX platform IDs
const DEX_PLATFORMS = {
  JUPITER: "JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4",
  RAYDIUM: "CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK",
  PUMPFUN: "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P",
  ORCA: "whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc",
}

// Token addresses
const TOKEN_ADDRESSES = {
  SOL: "So11111111111111111111111111111111111111112",
  USDC: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  USDT: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
}

// Activity types
const ACTIVITY_TYPES = {
  SWAP: "ACTIVITY_TOKEN_SWAP",
  ADD_LIQUIDITY: "ACTIVITY_TOKEN_ADD_LIQ",
}

// Default API key
const API_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjcmVhdGVkQXQiOjE3NDM1MDkzMTI1MjgsImVtYWlsIjoiamplZXR0MDAwMDdAZ21haWwuY29tIiwiYWN0aW9uIjoidG9rZW4tYXBpIiwiYXBpVmVyc2lvbiI6InYyIiwiaWF0IjoxNzQzNTA5MzEyfQ.GjtrzJmSbzbEJTjOw-N6kn6_o_7IjRcsg99Xc3Svz_8"

export default function DexActivitiesPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [activities, setActivities] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const [selectedToken, setSelectedToken] = useState(TOKEN_ADDRESSES.SOL)
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null)
  const [selectedActivityType, setSelectedActivityType] = useState<string>("all")
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  // Update the fetchDexActivities function to handle errors better
  const fetchDexActivities = async () => {
    setLoading(true)
    setError(null)

    try {
      // Build platform query parameters
      let platformParams = ""
      if (selectedPlatform) {
        platformParams = `&platform[]=${selectedPlatform}`
      } else {
        // If no specific platform selected, include all platforms
        Object.values(DEX_PLATFORMS).forEach((platform) => {
          platformParams += `&platform[]=${platform}`
        })
      }

      // Build activity type query parameters
      let activityTypeParams = ""
      if (selectedActivityType === "all") {
        activityTypeParams = `&activity_type[]=${ACTIVITY_TYPES.SWAP}`

        // Only add liquidity activity type for PumpFun
        if (selectedPlatform === DEX_PLATFORMS.PUMPFUN || !selectedPlatform) {
          activityTypeParams += `&activity_type[]=${ACTIVITY_TYPES.ADD_LIQUIDITY}`
        }
      } else {
        activityTypeParams = `&activity_type[]=${selectedActivityType}`
      }

      const requestOptions = {
        method: "GET",
        headers: {
          token: API_KEY,
          "Content-Type": "application/json",
        },
      }

      try {
        const response = await fetch(
          `https://pro-api.solscan.io/v2.0/token/defi/activities?address=${selectedToken}${platformParams}${activityTypeParams}&page=1&page_size=20&sort_by=block_time&sort_order=desc`,
          requestOptions,
        )

        if (!response.ok) {
          const errorText = await response.text()
          console.error(`API response error: ${response.status} - ${errorText}`)
          throw new Error(`API request failed with status ${response.status}`)
        }

        const data = await response.json()

        if (data.success && data.data) {
          setActivities(data.data)
          setLastUpdated(new Date())
        } else {
          console.error("API returned success: false", data)
          setActivities([])
          setError("Failed to fetch DEX activities. The API returned an unsuccessful response.")
        }
      } catch (fetchError) {
        console.error("Fetch error in DEX activities:", fetchError)
        setActivities([])
        setError("Failed to fetch DEX activities. The API may be unavailable.")
      }
    } catch (error) {
      console.error("Error fetching DEX activities:", error)
      setActivities([])
      setError("Failed to fetch DEX activities. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDexActivities()
  }, [selectedToken, selectedPlatform, selectedActivityType])

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

  // Get platform badge color
  const getPlatformBadgeClass = (platformId: string) => {
    switch (platformId) {
      case DEX_PLATFORMS.JUPITER:
        return "bg-primary text-primary-foreground"
      case DEX_PLATFORMS.RAYDIUM:
        return "bg-secondary text-secondary-foreground"
      case DEX_PLATFORMS.PUMPFUN:
        return "bg-tertiary text-tertiary-foreground"
      case DEX_PLATFORMS.ORCA:
        return "bg-quaternary text-quaternary-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  // Get activity type badge color
  const getActivityTypeBadgeClass = (activityType: string) => {
    switch (activityType) {
      case ACTIVITY_TYPES.SWAP:
        return "bg-secondary/20 text-secondary dark:bg-secondary/30"
      case ACTIVITY_TYPES.ADD_LIQUIDITY:
        return "bg-success/20 text-success dark:bg-success/30"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  // Format token amount
  const formatTokenAmount = (amount: number, decimals: number) => {
    return (amount / Math.pow(10, decimals)).toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: decimals > 6 ? 4 : 2,
    })
  }

  // Format address for display
  const formatAddress = (address: string) => {
    if (!address) return ""
    if (address.length <= 12) return address
    return `${address.substring(0, 6)}...${address.substring(address.length - 6)}`
  }

  // Get token name from address
  const getTokenName = (tokenAddress: string, metadata: any) => {
    if (metadata?.tokens && metadata.tokens[tokenAddress]) {
      return metadata.tokens[tokenAddress].token_symbol
    }

    switch (tokenAddress) {
      case TOKEN_ADDRESSES.SOL:
        return "SOL"
      case TOKEN_ADDRESSES.USDC:
        return "USDC"
      case TOKEN_ADDRESSES.USDT:
        return "USDT"
      default:
        return formatAddress(tokenAddress)
    }
  }

  // Get token icon from metadata
  const getTokenIcon = (tokenAddress: string, metadata: any) => {
    if (metadata?.tokens && metadata.tokens[tokenAddress]) {
      return metadata.tokens[tokenAddress].token_icon
    }
    return null
  }

  // Get activity type display name
  const getActivityTypeDisplay = (activityType: string) => {
    switch (activityType) {
      case ACTIVITY_TYPES.SWAP:
        return "Swap"
      case ACTIVITY_TYPES.ADD_LIQUIDITY:
        return "Add Liquidity"
      case "ACTIVITY_AGG_TOKEN_SWAP":
        return "Aggregated Swap"
      default:
        return activityType.replace("ACTIVITY_", "").replace(/_/g, " ")
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex items-center justify-between p-4 sm:p-6 border-b gradient-bg">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">DEX Activities</h1>
          <p className="text-sm text-white/80">Monitor real-time swap activities across major Solana DEXs</p>
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
            onClick={fetchDexActivities}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      <div className="p-4 sm:p-6 flex-1">
        <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-between">
          <div className="flex flex-col sm:flex-row gap-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Token</label>
              <Select value={selectedToken} onValueChange={setSelectedToken}>
                <SelectTrigger className="w-full sm:w-[180px] border-primary/20 focus:ring-primary">
                  <SelectValue placeholder="Select Token" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={TOKEN_ADDRESSES.SOL}>SOL</SelectItem>
                  <SelectItem value={TOKEN_ADDRESSES.USDC}>USDC</SelectItem>
                  <SelectItem value={TOKEN_ADDRESSES.USDT}>USDT</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">Platform</label>
              <Select
                value={selectedPlatform || "all"}
                onValueChange={(value) => setSelectedPlatform(value === "all" ? null : value)}
              >
                <SelectTrigger className="w-full sm:w-[180px] border-secondary/20 focus:ring-secondary">
                  <SelectValue placeholder="All Platforms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Platforms</SelectItem>
                  <SelectItem value={DEX_PLATFORMS.JUPITER}>Jupiter</SelectItem>
                  <SelectItem value={DEX_PLATFORMS.RAYDIUM}>Raydium</SelectItem>
                  <SelectItem value={DEX_PLATFORMS.PUMPFUN}>Pumpfun</SelectItem>
                  <SelectItem value={DEX_PLATFORMS.ORCA}>Orca</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">Activity Type</label>
              <Select value={selectedActivityType} onValueChange={setSelectedActivityType}>
                <SelectTrigger className="w-full sm:w-[180px] border-tertiary/20 focus:ring-tertiary">
                  <SelectValue placeholder="All Activities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Activities</SelectItem>
                  <SelectItem value={ACTIVITY_TYPES.SWAP}>Swaps</SelectItem>
                  {(selectedPlatform === DEX_PLATFORMS.PUMPFUN || !selectedPlatform) && (
                    <SelectItem value={ACTIVITY_TYPES.ADD_LIQUIDITY}>Add Liquidity</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          {lastUpdated && (
            <div className="flex items-center text-muted-foreground text-xs">
              <RefreshCw className="h-3 w-3 mr-1" />
              Last updated: {lastUpdated.toLocaleTimeString()}
            </div>
          )}
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader className="px-4 sm:px-6">
            <CardTitle>Recent DEX Activities</CardTitle>
            <CardDescription>
              Latest {selectedActivityType === "all" ? "" : getActivityTypeDisplay(selectedActivityType) + " "}
              activities {selectedPlatform ? `on ${getPlatformName(selectedPlatform)}` : "across all platforms"}
            </CardDescription>
          </CardHeader>
          <CardContent className="px-0 sm:px-6 overflow-auto">
            <div className="overflow-x-auto">
              {loading ? (
                <div className="space-y-2 px-4 sm:px-0">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : activities.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No DEX activities found for the selected criteria.
                </div>
              ) : (
                <Table className="min-w-[800px]">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transaction</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Platform</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>From</TableHead>
                      <TableHead>To</TableHead>
                      <TableHead>Value (USD)</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activities.map((activity) => {
                      // Extract token details
                      const fromToken = activity.routers?.token1 || ""
                      const toToken = activity.routers?.token2 || ""
                      const fromAmount = activity.routers?.amount1 || 0
                      const toAmount = activity.routers?.amount2 || 0
                      const fromDecimals = activity.routers?.token1_decimals || 0
                      const toDecimals = activity.routers?.token2_decimals || 0

                      // Get token names and icons
                      const fromTokenName = getTokenName(fromToken, activity.metadata)
                      const toTokenName = getTokenName(toToken, activity.metadata)
                      const fromTokenIcon = getTokenIcon(fromToken, activity.metadata)
                      const toTokenIcon = getTokenIcon(toToken, activity.metadata)

                      // Format amounts
                      const formattedFromAmount = formatTokenAmount(fromAmount, fromDecimals)
                      const formattedToAmount = formatTokenAmount(toAmount, toDecimals)

                      // Get platform info
                      const platform = Array.isArray(activity.platform) ? activity.platform[0] : activity.platform
                      const platformName = getPlatformName(platform)
                      const platformBadgeClass = getPlatformBadgeClass(platform)

                      // Get activity type info
                      const activityType = activity.activity_type
                      const activityTypeDisplay = getActivityTypeDisplay(activityType)
                      const activityTypeBadgeClass = getActivityTypeBadgeClass(activityType)

                      return (
                        <TableRow key={activity.trans_id}>
                          <TableCell className="font-mono text-xs sm:text-sm">
                            <Link href={`/tx/${activity.trans_id}`} className="hover:text-primary hover:underline">
                              {formatAddress(activity.trans_id)}
                            </Link>
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm">
                            {formatDistanceToNow(new Date(activity.time), { addSuffix: true })}
                          </TableCell>
                          <TableCell>
                            <Badge className={platformBadgeClass}>{platformName}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={activityTypeBadgeClass}>
                              {activityType === ACTIVITY_TYPES.ADD_LIQUIDITY ? (
                                <Plus className="h-3 w-3 mr-1" />
                              ) : (
                                <ArrowUpDown className="h-3 w-3 mr-1" />
                              )}
                              {activityTypeDisplay}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              {fromTokenIcon && (
                                <div className="w-4 h-4 relative">
                                  <img
                                    src={fromTokenIcon || "/placeholder.svg"}
                                    alt={fromTokenName}
                                    className="w-full h-full object-contain"
                                    onError={(e) => {
                                      ;(e.target as HTMLImageElement).style.display = "none"
                                    }}
                                  />
                                </div>
                              )}
                              <span className="text-xs sm:text-sm">
                                {formattedFromAmount} {fromTokenName}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              {toTokenIcon && (
                                <div className="w-4 h-4 relative">
                                  <img
                                    src={toTokenIcon || "/placeholder.svg"}
                                    alt={toTokenName}
                                    className="w-full h-full object-contain"
                                    onError={(e) => {
                                      ;(e.target as HTMLImageElement).style.display = "none"
                                    }}
                                  />
                                </div>
                              )}
                              <span className="text-xs sm:text-sm">
                                {formattedToAmount} {toTokenName}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium text-xs sm:text-sm">
                            ${activity.value ? Number(activity.value).toLocaleString() : "N/A"}
                          </TableCell>
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
      </div>
    </div>
  )
}
