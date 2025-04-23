"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { TokenFlowTable } from "@/components/tables/token-flow-table"
import { fetchTokenFlows } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"
import { Search } from "lucide-react"

interface TokenFlowPanelProps {
  apiKey: string
}

export default function TokenFlowPanel({ apiKey }: TokenFlowPanelProps) {
  const [loading, setLoading] = useState(true)
  const [tokenFlows, setTokenFlows] = useState([])
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    if (!apiKey) return

    const fetchData = async () => {
      setLoading(true)
      try {
        // In a real application, this would be an actual API call
        const flowData = await fetchTokenFlows(apiKey)
        setTokenFlows(flowData)
      } catch (error) {
        console.error("Error fetching token flow data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    // Set up polling for real-time updates
    const interval = setInterval(fetchData, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [apiKey])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would trigger a search API call
    console.log("Searching for token:", searchQuery)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 sm:p-6 border-b gradient-bg">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Token Flow</h1>
          <p className="text-sm text-white/80">Visualize token flows between major addresses</p>
        </div>
      </div>

      <div className="p-4 sm:p-6 flex-1 overflow-auto">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 mb-6">
          <Input
            placeholder="Search by token symbol or address"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 border-quinary/20 focus-visible:ring-quinary"
          />
          <Button type="submit" className="bg-quinary hover:bg-quinary/90 w-full sm:w-auto">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </form>

        <Card className="mb-6 border-2 border-quinary/20">
          <CardHeader className="px-3 sm:px-6">
            <CardTitle>Token Flow Visualization</CardTitle>
            <CardDescription>Visual representation of token movements</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] sm:h-[400px] px-3 sm:px-6">
            {loading ? (
              <Skeleton className="h-full w-full" />
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                Flow visualization will be displayed here
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="px-3 sm:px-6">
            <CardTitle>Recent Token Transfers</CardTitle>
            <CardDescription>Latest significant token transfers</CardDescription>
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
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : (
                <TokenFlowTable flows={tokenFlows} />
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
