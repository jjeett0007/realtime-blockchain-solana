"use client"

import { useState, useEffect } from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import DashboardSidebar from "@/components/dashboard-sidebar"
import DashboardContent from "@/components/dashboard-content"
import { useTheme } from "next-themes"
import { useIsMobile } from "@/hooks/use-mobile"
import { MobileNav } from "@/components/mobile-nav"

export default function Dashboard() {
  const [activeView, setActiveView] = useState<string>("overview")
  const [mounted, setMounted] = useState(false)
  const { theme } = useTheme()
  const isMobile = useIsMobile()

  // Ensure theme is available on client side
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="flex h-screen w-full bg-background">
        <DashboardSidebar activeView={activeView} setActiveView={setActiveView} />
        <DashboardContent activeView={activeView} />
        <MobileNav activeView={activeView} setActiveView={setActiveView} />
      </div>
    </SidebarProvider>
  )
}
