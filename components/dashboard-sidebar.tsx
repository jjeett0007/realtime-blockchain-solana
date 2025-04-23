"use client"

import { Activity, AlertTriangle, BarChart3, Coins, LineChart, RefreshCcw, Settings, Wallet } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"

interface DashboardSidebarProps {
  activeView: string
  setActiveView: (view: string) => void
}

export default function DashboardSidebar({ activeView, setActiveView }: DashboardSidebarProps) {
  return (
    <Sidebar>
      <SidebarHeader className="flex flex-col gap-2 p-4">
        <div className="flex items-center gap-2">
          <Activity className="h-6 w-6 text-sidebar-accent" />
          <span className="text-xl font-bold">JET SCAN MONITOR</span>
        </div>
        <p className="text-xs text-sidebar-foreground/70">Real-time Solana blockchain monitoring</p>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Monitoring</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton isActive={activeView === "overview"} onClick={() => setActiveView("overview")}>
                  <BarChart3 />
                  <span>Overview</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeView === "whale-activity"}
                  onClick={() => setActiveView("whale-activity")}
                >
                  <Wallet />
                  <span>Whale Activity</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <Link href="/dex-activities" passHref legacyBehavior>
                  <SidebarMenuButton asChild>
                    <a>
                      <RefreshCcw />
                      <span>DEX Activities</span>
                    </a>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton isActive={activeView === "token-flow"} onClick={() => setActiveView("token-flow")}>
                  <Coins />
                  <span>Token Flow</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarSeparator />
        <SidebarGroup>
          <SidebarGroupLabel>Alerts</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton isActive={activeView === "alerts"} onClick={() => setActiveView("alerts")}>
                  <AlertTriangle />
                  <span>Alert Configuration</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <div className="flex items-center justify-between">
          <Button variant="outline" size="icon" asChild className="border-sidebar-accent bg-sidebar-accent/10">
            <a href="#settings">
              <Settings className="h-4 w-4 text-sidebar-accent" />
              <span className="sr-only">Settings</span>
            </a>
          </Button>
          <ThemeToggle />
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
