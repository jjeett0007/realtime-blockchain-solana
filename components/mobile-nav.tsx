"use client"

import { useState } from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu, Activity, BarChart3, Wallet, LineChart, Coins, RefreshCcw } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"
import Link from "next/link"

interface MobileNavProps {
  activeView: string
  setActiveView: (view: string) => void
}

export function MobileNav({ activeView, setActiveView }: MobileNavProps) {
  const [open, setOpen] = useState(false)
  const isMobile = useIsMobile()

  if (!isMobile) return null

  const handleViewChange = (view: string) => {
    setActiveView(view)
    setOpen(false)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-4 right-4 z-50 h-12 w-12 rounded-full shadow-lg border-primary bg-primary text-primary-foreground"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[60vh] rounded-t-xl pt-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold mb-4 px-2">Navigation</h2>

          <Button
            variant={activeView === "overview" ? "default" : "ghost"}
            className={`justify-start ${activeView === "overview" ? "bg-primary text-primary-foreground" : ""}`}
            onClick={() => handleViewChange("overview")}
          >
            <BarChart3 className="mr-2 h-5 w-5" />
            Overview
          </Button>

          <Button
            variant={activeView === "whale-activity" ? "default" : "ghost"}
            className={`justify-start ${activeView === "whale-activity" ? "bg-tertiary text-tertiary-foreground" : ""}`}
            onClick={() => handleViewChange("whale-activity")}
          >
            <Wallet className="mr-2 h-5 w-5" />
            Whale Activity
          </Button>

          <Button
            variant={activeView === "dex-monitoring" ? "default" : "ghost"}
            className={`justify-start ${activeView === "dex-monitoring" ? "bg-quaternary text-quaternary-foreground" : ""}`}
            onClick={() => handleViewChange("dex-monitoring")}
          >
            <LineChart className="mr-2 h-5 w-5" />
            DEX Monitoring
          </Button>

          <Link href="/dex-activities" passHref>
            <Button variant="ghost" className="justify-start" onClick={() => setOpen(false)}>
              <RefreshCcw className="mr-2 h-5 w-5" />
              DEX Activities
            </Button>
          </Link>

          <Button
            variant={activeView === "token-flow" ? "default" : "ghost"}
            className={`justify-start ${activeView === "token-flow" ? "bg-quinary text-quinary-foreground" : ""}`}
            onClick={() => handleViewChange("token-flow")}
          >
            <Coins className="mr-2 h-5 w-5" />
            Token Flow
          </Button>

          <Button
            variant={activeView === "alerts" ? "default" : "ghost"}
            className={`justify-start ${activeView === "alerts" ? "bg-primary text-primary-foreground" : ""}`}
            onClick={() => handleViewChange("alerts")}
          >
            <Activity className="mr-2 h-5 w-5" />
            Alerts
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
