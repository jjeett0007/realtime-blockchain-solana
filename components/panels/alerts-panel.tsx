"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { AlertsTable } from "@/components/tables/alerts-table"
import { AlertConfigForm } from "@/components/alert-config-form"
import { Plus } from "lucide-react"

interface AlertsPanelProps {
  apiKey: string
}

export default function AlertsPanel({ apiKey }: AlertsPanelProps) {
  const [showForm, setShowForm] = useState(false)

  // Mock alerts data
  const alerts = [
    {
      id: "1",
      type: "Whale Transaction",
      condition: "Transaction > 100,000 SOL",
      status: "Active",
      createdAt: "2023-04-15T10:30:00Z",
    },
    {
      id: "2",
      type: "Token Price",
      condition: "SOL price change > 5% in 1h",
      status: "Active",
      createdAt: "2023-04-14T14:20:00Z",
    },
    {
      id: "3",
      type: "Liquidity Change",
      condition: "Pool liquidity decrease > 20%",
      status: "Inactive",
      createdAt: "2023-04-10T09:15:00Z",
    },
  ]

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 border-b gradient-bg">
        <div className="mb-4 sm:mb-0">
          <h1 className="text-xl sm:text-2xl font-bold text-white">Alert Configuration</h1>
          <p className="text-sm text-white/80">Set up and manage your monitoring alerts</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="bg-primary hover:bg-primary/90 w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          New Alert
        </Button>
      </div>

      <div className="p-4 sm:p-6 flex-1 overflow-auto">
        {showForm ? (
          <Card className="mb-6 border-2 border-primary/20">
            <CardHeader className="px-3 sm:px-6">
              <CardTitle>Create New Alert</CardTitle>
              <CardDescription>Configure parameters for your new alert</CardDescription>
            </CardHeader>
            <CardContent className="px-3 sm:px-6">
              <AlertConfigForm onCancel={() => setShowForm(false)} apiKey={apiKey} />
            </CardContent>
          </Card>
        ) : null}

        <Tabs defaultValue="active" className="mb-6">
          <TabsList className="bg-primary/10 dark:bg-primary/20 w-full">
            <TabsTrigger
              value="active"
              className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Active Alerts
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Alert History
            </TabsTrigger>
          </TabsList>
          <TabsContent value="active">
            <Card>
              <CardHeader className="px-3 sm:px-6">
                <CardTitle>Active Alerts</CardTitle>
                <CardDescription>Currently active monitoring alerts</CardDescription>
              </CardHeader>
              <CardContent className="px-0 sm:px-6 overflow-auto">
                <div className="overflow-x-auto">
                  <AlertsTable alerts={alerts.filter((a) => a.status === "Active")} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="history">
            <Card>
              <CardHeader className="px-3 sm:px-6">
                <CardTitle>Alert History</CardTitle>
                <CardDescription>Past alerts and notifications</CardDescription>
              </CardHeader>
              <CardContent className="px-0 sm:px-6 overflow-auto">
                <div className="overflow-x-auto">
                  <AlertsTable alerts={alerts} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
