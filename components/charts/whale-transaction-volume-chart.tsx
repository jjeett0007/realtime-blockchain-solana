"use client"

import { useEffect, useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Skeleton } from "@/components/ui/skeleton"
import { TOKEN_ADDRESSES } from "@/lib/api"

interface WhaleTransaction {
  id: string
  signature: string
  blockTime: string
  amount: string
  value?: string
  token: string
  tokenIcon?: string
  sender: string
  receiver: string
  fromTokenAccount?: string
  toTokenAccount?: string
  activityType?: string
}

interface WhaleTransactionVolumeChartProps {
  transactions: WhaleTransaction[]
  selectedToken: string
  isLoading: boolean
}

export function WhaleTransactionVolumeChart({
  transactions,
  selectedToken,
  isLoading,
}: WhaleTransactionVolumeChartProps) {
  const [chartData, setChartData] = useState<any[]>([])

  useEffect(() => {
    if (transactions.length === 0) return

    // Process transactions to create chart data
    const processTransactions = () => {
      // Group transactions by hour
      const hourlyData: Record<
        string,
        {
          hour: string
          USDC: number
          USDT: number
          total: number
          timestamp: number
        }
      > = {}

      // Process each transaction
      transactions.forEach((tx) => {
        // Extract value from transaction
        let value = 0
        if (tx.value) {
          // Remove $ and commas, then parse as float
          value = Number.parseFloat(tx.value.replace("$", "").replace(/,/g, ""))
        } else {
          // If no value, try to extract from amount
          const amountMatch = tx.amount.match(/[\d,]+\.?\d*/)
          if (amountMatch) {
            value = Number.parseFloat(amountMatch[0].replace(/,/g, ""))
          }
        }

        // Skip if we couldn't extract a value
        if (isNaN(value)) return

        // Get hour from timestamp
        const date = new Date(tx.blockTime)
        const hourKey = date.toISOString().substring(0, 13) // YYYY-MM-DDTHH format
        const hourLabel = `${date.getHours()}:00`
        const timestamp = date.getTime()

        // Initialize hour data if not exists
        if (!hourlyData[hourKey]) {
          hourlyData[hourKey] = {
            hour: hourLabel,
            USDC: 0,
            USDT: 0,
            total: 0,
            timestamp,
          }
        }

        // Add value to appropriate token
        if (tx.token === "USDC") {
          hourlyData[hourKey].USDC += value
          hourlyData[hourKey].total += value
        } else if (tx.token === "USDT") {
          hourlyData[hourKey].USDT += value
          hourlyData[hourKey].total += value
        }
      })

      // Convert to array and sort by timestamp
      const dataArray = Object.values(hourlyData)
      dataArray.sort((a, b) => a.timestamp - b.timestamp)

      // Format values to 2 decimal places
      dataArray.forEach((item) => {
        item.USDC = Number.parseFloat(item.USDC.toFixed(2))
        item.USDT = Number.parseFloat(item.USDT.toFixed(2))
        item.total = Number.parseFloat(item.total.toFixed(2))
      })

      return dataArray
    }

    // Update chart data
    const newChartData = processTransactions()

    // Merge with existing chart data without duplicates
    if (chartData.length > 0) {
      const existingHours = new Set(chartData.map((item) => item.hour))
      const uniqueNewData = newChartData.filter((item) => !existingHours.has(item.hour))

      if (uniqueNewData.length > 0) {
        setChartData([...chartData, ...uniqueNewData].sort((a, b) => a.timestamp - b.timestamp))
      }
    } else {
      setChartData(newChartData)
    }
  }, [transactions])

  if (isLoading && chartData.length === 0) {
    return <Skeleton className="h-full w-full" />
  }

  if (chartData.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">No transaction data available</div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={chartData}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="hour" />
        <YAxis
          tickFormatter={(value) =>
            `$${
              value >= 1000000
                ? `${(value / 1000000).toFixed(1)}M`
                : value >= 1000
                  ? `${(value / 1000).toFixed(1)}K`
                  : value
            }`
          }
        />
        <Tooltip
          formatter={(value: number) => [`$${value.toLocaleString()}`, "Volume"]}
          labelFormatter={(label) => `Hour: ${label}`}
        />
        <Legend />
        {selectedToken === "all" ? (
          <>
            <Bar
              dataKey="USDC"
              name="USDC Volume"
              fill="#2775CA" // USDC blue
              stackId="a"
            />
            <Bar
              dataKey="USDT"
              name="USDT Volume"
              fill="#26A17B" // USDT green
              stackId="a"
            />
          </>
        ) : selectedToken === TOKEN_ADDRESSES.USDC ? (
          <Bar
            dataKey="USDC"
            name="USDC Volume"
            fill="#2775CA" // USDC blue
          />
        ) : selectedToken === TOKEN_ADDRESSES.USDT ? (
          <Bar
            dataKey="USDT"
            name="USDT Volume"
            fill="#26A17B" // USDT green
          />
        ) : (
          <Bar
            dataKey="total"
            name="Total Volume"
            fill="#6366f1" // Primary color
          />
        )}
      </BarChart>
    </ResponsiveContainer>
  )
}
