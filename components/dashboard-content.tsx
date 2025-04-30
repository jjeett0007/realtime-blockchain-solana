"use client"

import { useEffect, useState } from "react"
import OverviewPanel from "@/components/panels/overview-panel"
import WhaleActivityPanel from "@/components/panels/whale-activity-panel"
import DexMonitoringPanel from "@/components/panels/dex-monitoring-panel"
import TokenFlowPanel from "@/components/panels/token-flow-panel"
import AlertsPanel from "@/components/panels/alerts-panel"
import { SidebarInset } from "@/components/ui/sidebar"
import { ApiKeyModal } from "@/components/api-key-modal"

interface DashboardContentProps {
  activeView: string
}


export default function DashboardContent({ activeView }: DashboardContentProps) {

  const renderPanel = () => {
    switch (activeView) {
      case "overview":
        return <OverviewPanel />
      case "whale-activity":
        return <WhaleActivityPanel />
      case "dex-monitoring":
        return <DexMonitoringPanel />
      case "token-flow":
        return <TokenFlowPanel />
      case "alerts":
        return <AlertsPanel />
      default:
        return <OverviewPanel />
    }
  }

  return (
    <SidebarInset className="p-0">
      {renderPanel()}
    </SidebarInset>
  )
}
