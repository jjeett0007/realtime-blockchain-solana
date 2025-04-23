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

// Default API key
const DEFAULT_API_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjcmVhdGVkQXQiOjE3NDM1MDkzMTI1MjgsImVtYWlsIjoiamplZXR0MDAwMDdAZ21haWwuY29tIiwiYWN0aW9uIjoidG9rZW4tYXBpIiwiYXBpVmVyc2lvbiI6InYyIiwiaWF0IjoxNzQzNTA5MzEyfQ.GjtrzJmSbzbEJTjOw-N6kn6_o_7IjRcsg99Xc3Svz_8"

export default function DashboardContent({ activeView }: DashboardContentProps) {
  const [apiKey, setApiKey] = useState<string>(DEFAULT_API_KEY)
  const [showApiKeyModal, setShowApiKeyModal] = useState<boolean>(false)

  useEffect(() => {
    const storedApiKey = localStorage.getItem("jetscan-api-key")
    if (storedApiKey) {
      setApiKey(storedApiKey)
      setShowApiKeyModal(false)
    } else {
      // Use default API key and save it to localStorage
      localStorage.setItem("jetscan-api-key", DEFAULT_API_KEY)
      setShowApiKeyModal(false)
    }
  }, [])

  const saveApiKey = (key: string) => {
    localStorage.setItem("jetscan-api-key", key)
    setApiKey(key)
    setShowApiKeyModal(false)
  }

  const renderPanel = () => {
    switch (activeView) {
      case "overview":
        return <OverviewPanel apiKey={apiKey} />
      case "whale-activity":
        return <WhaleActivityPanel apiKey={apiKey} />
      case "dex-monitoring":
        return <DexMonitoringPanel apiKey={apiKey} />
      case "token-flow":
        return <TokenFlowPanel apiKey={apiKey} />
      case "alerts":
        return <AlertsPanel apiKey={apiKey} />
      default:
        return <OverviewPanel apiKey={apiKey} />
    }
  }

  return (
    <SidebarInset className="p-0">
      {apiKey || !showApiKeyModal ? (
        renderPanel()
      ) : (
        <div className="flex h-full items-center justify-center">
          <ApiKeyModal open={showApiKeyModal} onSave={saveApiKey} />
        </div>
      )}
    </SidebarInset>
  )
}
