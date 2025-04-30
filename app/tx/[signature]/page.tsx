"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  AlertCircle,
  ArrowLeft,
  ArrowUpDown,
  CheckCircle2,
  Clock,
  Code,
  Coins,
  Copy,
  ExternalLink,
  FileText,
  XCircle,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"

type TransactionDetailsProps = {}

export default function TransactionDetailsPage({ }: TransactionDetailsProps) {
  const params = useParams()
  const router = useRouter()
  const [txData, setTxData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const signature = params.signature as string

  useEffect(() => {
    const fetchTransactionDetails = async () => {
      setLoading(true)
      setError(null)
      try {
        const requestOptions = {
          method: "GET",
          headers: {
            token:
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjcmVhdGVkQXQiOjE3NDM1MDkzMTI1MjgsImVtYWlsIjoiamplZXR0MDAwMDdAZ21haWwuY29tIiwiYWN0aW9uIjoidG9rZW4tYXBpIiwiYXBpVmVyc2lvbiI6InYyIiwiaWF0IjoxNzQzNTA5MzEyfQ.GjtrzJmSbzbEJTjOw-N6kn6_o_7IjRcsg99Xc3Svz_8",
            "Content-Type": "application/json",
          },
        }

        try {
          const response = await fetch(
            `https://pro-api.solscan.io/v2.0/transaction/detail?tx=${signature}`,
            requestOptions,
          )

          if (!response.ok) {
            const errorText = await response.text()
            
            throw new Error(`API request failed with status ${response.status}`)
          }

          const data = await response.json()

          if (data.success) {
            setTxData(data)
          } else {
            
            throw new Error("Failed to fetch transaction data")
          }
        } catch (fetchError) {
          console.error("Fetch error in transaction details:", fetchError)
          setError("Failed to fetch transaction details. The transaction may not exist or the API may be unavailable.")
        }
      } catch (error) {
        console.error("Error fetching transaction details:", error)
        setError("Failed to fetch transaction details. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    if (signature) {
      fetchTransactionDetails()
    }
  }, [signature])

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        // Could add a toast notification here
       
      })
      .catch((err) => {
       
      })
  }

  const formatAddress = (address: string, length = 8) => {
    if (!address) return ""
    if (address.length <= length * 2) return address
    return `${address.substring(0, length)}...${address.substring(address.length - length)}`
  }

  const formatAmount = (amount: string | number, decimals: number, symbol: string) => {
    const value = typeof amount === "string" ? Number.parseFloat(amount) : amount
    const formattedValue = (value / Math.pow(10, decimals)).toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 6,
    })
    return `${formattedValue} ${symbol}`
  }

  const getTokenInfo = (address: string) => {
    if (!txData?.metadata?.tokens) return { symbol: "Unknown", icon: null }
    return txData.metadata.tokens[address] || { token_symbol: "Unknown", token_icon: null }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex items-center justify-between p-4 sm:p-6 border-b gradient-bg">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Transaction Details</h1>
          <p className="text-sm text-white/80">View detailed information about this transaction</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          onClick={() => router.push("/")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Dashboard
        </Button>
      </div>

      <div className="p-4 sm:p-6 flex-1">
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-[200px] w-full rounded-lg" />
            <Skeleton className="h-[400px] w-full rounded-lg" />
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : txData ? (
          <div className="space-y-6">
            {/* Transaction Overview */}
            <Card>
              <CardHeader className="px-4 sm:px-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <CardTitle className="text-lg sm:text-xl">Transaction Overview</CardTitle>
                    <CardDescription>Basic information about this transaction</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={txData.data.status === 1 ? "success" : "destructive"} className="px-3 py-1">
                      {txData.data.status === 1 ? (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Success
                        </>
                      ) : (
                        <>
                          <XCircle className="h-3.5 w-3.5 mr-1" /> Failed
                        </>
                      )}
                    </Badge>
                    <a
                      href={`https://solscan.io/tx/${signature}`}
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
              </CardHeader>
              <CardContent className="px-4 sm:px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Signature</h3>
                      <div className="flex items-center">
                        <p className="font-mono text-sm break-all">{txData.data.tx_hash}</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="ml-2 h-6 w-6 p-0"
                          onClick={() => copyToClipboard(txData.data.tx_hash)}
                        >
                          <Copy className="h-3.5 w-3.5" />
                          <span className="sr-only">Copy signature</span>
                        </Button>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Block</h3>
                      <p className="font-mono text-sm">{txData.data.block_id}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Timestamp</h3>
                      <div className="flex items-center">
                        <Clock className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                        <p className="text-sm">
                          {new Date(txData.data.block_time * 1000).toLocaleString()}
                          <span className="text-muted-foreground ml-1">
                            ({formatDistanceToNow(new Date(txData.data.block_time * 1000), { addSuffix: true })})
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Fee</h3>
                      <p className="text-sm">{(txData.data.fee / 1000000).toFixed(6)} SOL</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Compute Units</h3>
                      <p className="text-sm">{txData.data.compute_units_consumed.toLocaleString()} units consumed</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Recent Blockhash</h3>
                      <p className="font-mono text-sm">{txData.data.recent_block_hash}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Token Transfers */}
            {txData.data.token_bal_change && txData.data.token_bal_change.length > 0 && (
              <Card>
                <CardHeader className="px-4 sm:px-6">
                  <CardTitle className="flex items-center">
                    <Coins className="h-5 w-5 mr-2 text-primary" />
                    Token Transfers
                  </CardTitle>
                  <CardDescription>Token transfers in this transaction</CardDescription>
                </CardHeader>
                <CardContent className="px-0 sm:px-6 overflow-auto">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[600px] border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Token</th>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">From</th>
                          <th className="text-center py-3 px-4 font-medium text-muted-foreground"></th>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">To</th>
                          <th className="text-right py-3 px-4 font-medium text-muted-foreground">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {txData.data.token_bal_change
                          .map((transfer: any, index: number) => {
                            // Find the corresponding transfer in the other direction
                            const pair = txData.data.token_bal_change.find(
                              (t: any) =>
                                t.token_address === transfer.token_address && t.change_type !== transfer.change_type,
                            )

                            // Only process one side of the transfer
                            if (pair && transfer.change_type === "dec") {
                              const tokenInfo = getTokenInfo(transfer.token_address)
                              return (
                                <tr key={index} className="border-b">
                                  <td className="py-3 px-4">
                                    <div className="flex items-center">
                                      {tokenInfo.token_icon && (
                                        <div className="w-5 h-5 mr-2">
                                          <img
                                            src={tokenInfo.token_icon || "/placeholder.svg"}
                                            alt={tokenInfo.token_symbol}
                                            className="w-full h-full object-contain"
                                            onError={(e) => {
                                              ; (e.target as HTMLImageElement).style.display = "none"
                                            }}
                                          />
                                        </div>
                                      )}
                                      <span>{tokenInfo.token_symbol || "Unknown"}</span>
                                    </div>
                                  </td>
                                  <td className="py-3 px-4">
                                    <div className="flex flex-col">
                                      <Link
                                        href={`/account/${transfer.owner}`}
                                        className="font-mono text-xs hover:text-primary hover:underline"
                                      >
                                        {formatAddress(transfer.owner)}
                                      </Link>
                                      <span className="text-xs text-muted-foreground">
                                        Account: {formatAddress(transfer.address)}
                                      </span>
                                    </div>
                                  </td>
                                  <td className="py-3 px-4 text-center">
                                    <ArrowUpDown className="h-4 w-4 inline-block text-muted-foreground" />
                                  </td>
                                  <td className="py-3 px-4">
                                    <div className="flex flex-col">
                                      <Link
                                        href={`/account/${pair.owner}`}
                                        className="font-mono text-xs hover:text-primary hover:underline"
                                      >
                                        {formatAddress(pair.owner)}
                                      </Link>
                                      <span className="text-xs text-muted-foreground">
                                        Account: {formatAddress(pair.address)}
                                      </span>
                                    </div>
                                  </td>
                                  <td className="py-3 px-4 text-right">
                                    <span className="font-medium">
                                      {formatAmount(
                                        Math.abs(transfer.change_amount),
                                        transfer.decimals,
                                        tokenInfo.token_symbol || "",
                                      )}
                                    </span>
                                  </td>
                                </tr>
                              )
                            }
                            return null
                          })
                          .filter(Boolean)}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Transaction Details Tabs */}
            <Tabs defaultValue="instructions" className="w-full">
              <TabsList className="bg-primary/10 dark:bg-primary/20 w-full">
                <TabsTrigger
                  value="instructions"
                  className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <Code className="h-4 w-4 mr-2" />
                  Instructions
                </TabsTrigger>
                <TabsTrigger
                  value="accounts"
                  className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <Coins className="h-4 w-4 mr-2" />
                  Accounts
                </TabsTrigger>
                <TabsTrigger
                  value="logs"
                  className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Logs
                </TabsTrigger>
              </TabsList>

              <TabsContent value="instructions">
                <Card>
                  <CardHeader className="px-4 sm:px-6">
                    <CardTitle>Instructions</CardTitle>
                    <CardDescription>Instructions executed in this transaction</CardDescription>
                  </CardHeader>
                  <CardContent className="px-4 sm:px-6">
                    <div className="space-y-4">
                      {txData.data.parsed_instructions.map((instruction: any, index: number) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center">
                              <Badge variant="outline" className="mr-2">
                                #{index}
                              </Badge>
                              <h3 className="font-medium">{instruction.type}</h3>
                            </div>
                            <Badge>{instruction.program}</Badge>
                          </div>

                          {instruction.transfers && instruction.transfers.length > 0 && (
                            <div className="mt-3">
                              <h4 className="text-sm font-medium mb-2">Transfers</h4>
                              <div className="bg-muted/50 rounded-md p-3">
                                {instruction.transfers.map((transfer: any, tIndex: number) => {
                                  const tokenInfo = getTokenInfo(transfer.token_address)
                                  return (
                                    <div key={tIndex} className="flex items-center justify-between text-sm">
                                      <div className="flex items-center">
                                        <Link
                                          href={`/account/${transfer.source_owner}`}
                                          className="font-mono hover:text-primary hover:underline"
                                        >
                                          {formatAddress(transfer.source_owner)}
                                        </Link>
                                        <ArrowUpDown className="h-3.5 w-3.5 mx-2 text-muted-foreground" />
                                        <Link
                                          href={`/account/${transfer.destination_owner}`}
                                          className="font-mono hover:text-primary hover:underline"
                                        >
                                          {formatAddress(transfer.destination_owner)}
                                        </Link>
                                      </div>
                                      <div>
                                        {formatAmount(transfer.amount, transfer.decimals, tokenInfo.token_symbol || "")}
                                      </div>
                                    </div>
                                  )
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="accounts">
                <Card>
                  <CardHeader className="px-4 sm:px-6">
                    <CardTitle>Account Changes</CardTitle>
                    <CardDescription>SOL balance changes for accounts involved in this transaction</CardDescription>
                  </CardHeader>
                  <CardContent className="px-0 sm:px-6 overflow-auto">
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[600px] border-collapse">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-4 font-medium text-muted-foreground">Account</th>
                            <th className="text-right py-3 px-4 font-medium text-muted-foreground">Pre-Balance</th>
                            <th className="text-right py-3 px-4 font-medium text-muted-foreground">Post-Balance</th>
                            <th className="text-right py-3 px-4 font-medium text-muted-foreground">Change</th>
                          </tr>
                        </thead>
                        <tbody>
                          {txData.data.sol_bal_change.map((change: any, index: number) => (
                            <tr key={index} className="border-b">
                              <td className="py-3 px-4 font-mono text-sm">
                                <Link
                                  href={`/account/${change.address}`}
                                  className="hover:text-primary hover:underline"
                                >
                                  {formatAddress(change.address)}
                                </Link>
                              </td>
                              <td className="py-3 px-4 text-right">
                                {(Number.parseFloat(change.pre_balance) / 1000000000).toFixed(9)} SOL
                              </td>
                              <td className="py-3 px-4 text-right">
                                {(Number.parseFloat(change.post_balance) / 1000000000).toFixed(9)} SOL
                              </td>
                              <td className="py-3 px-4 text-right">
                                <span
                                  className={
                                    change.change_amount.startsWith("-")
                                      ? "text-destructive"
                                      : change.change_amount === "0"
                                        ? "text-muted-foreground"
                                        : "text-success"
                                  }
                                >
                                  {(Number.parseFloat(change.change_amount) / 1000000000).toFixed(9)} SOL
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="logs">
                <Card>
                  <CardHeader className="px-4 sm:px-6">
                    <CardTitle>Transaction Logs</CardTitle>
                    <CardDescription>Program execution logs</CardDescription>
                  </CardHeader>
                  <CardContent className="px-4 sm:px-6">
                    <div className="bg-muted/50 p-4 rounded-lg font-mono text-sm whitespace-pre-wrap overflow-auto max-h-[400px]">
                      {txData.data.log_message.map((log: string, index: number) => (
                        <div key={index} className="mb-1">
                          {log}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        ) : null}
      </div>
    </div>
  )
}
