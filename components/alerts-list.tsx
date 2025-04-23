"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowDown, ArrowUp, Wallet } from "lucide-react"

export function AlertsList() {
  // Mock alerts data
  const alerts = [
    {
      id: "1",
      type: "Whale Transaction",
      message: "Whale wallet 7YWH...3Pds transferred 25,000 SOL to 3xTR...9Qwe",
      time: "10 minutes ago",
      icon: Wallet,
      severity: "high",
    },
    {
      id: "2",
      type: "Price Change",
      message: "SOL price increased by 5.2% in the last hour",
      time: "1 hour ago",
      icon: ArrowUp,
      severity: "medium",
    },
    {
      id: "3",
      type: "Liquidity Change",
      message: "SOL/USDC pool liquidity decreased by 22% on Orca",
      time: "2 hours ago",
      icon: ArrowDown,
      severity: "high",
    },
    {
      id: "4",
      type: "Whale Transaction",
      message: "Whale wallet 5Gtr...7Yhj transferred 1,500,000 USDC to 9Plm...2Rty",
      time: "3 hours ago",
      icon: Wallet,
      severity: "medium",
    },
    {
      id: "5",
      type: "Price Change",
      message: "BONK price decreased by 8.5% in the last hour",
      time: "5 hours ago",
      icon: ArrowDown,
      severity: "low",
    },
  ]

  return (
    <ScrollArea className="h-[300px]">
      <div className="space-y-4 pr-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`flex items-start space-x-4 rounded-md border p-3 ${
              alert.severity === "high"
                ? "border-destructive/20 bg-destructive/5 dark:border-destructive/30 dark:bg-destructive/10"
                : alert.severity === "medium"
                  ? "border-warning/20 bg-warning/5 dark:border-warning/30 dark:bg-warning/10"
                  : "border-secondary/20 bg-secondary/5 dark:border-secondary/30 dark:bg-secondary/10"
            }`}
          >
            <div
              className={`rounded-full p-1 ${
                alert.severity === "high"
                  ? "bg-destructive/20 text-destructive dark:bg-destructive/30 dark:text-destructive-foreground"
                  : alert.severity === "medium"
                    ? "bg-warning/20 text-warning dark:bg-warning/30 dark:text-warning-foreground"
                    : "bg-secondary/20 text-secondary dark:bg-secondary/30 dark:text-secondary-foreground"
              }`}
            >
              <alert.icon className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{alert.type}</p>
                <p className="text-xs text-muted-foreground">{alert.time}</p>
              </div>
              <p className="text-sm mt-1">{alert.message}</p>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}
