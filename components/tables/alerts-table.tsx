"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatDistanceToNow } from "date-fns"
import { Switch } from "@/components/ui/switch"

interface Alert {
  id: string
  type: string
  condition: string
  status: string
  createdAt: string
}

interface AlertsTableProps {
  alerts: Alert[]
}

export function AlertsTable({ alerts }: AlertsTableProps) {
  return (
    <div className="w-full overflow-auto">
      <Table className="min-w-[600px]">
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Condition</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {alerts.map((alert) => (
            <TableRow key={alert.id}>
              <TableCell className="text-xs sm:text-sm">{alert.type}</TableCell>
              <TableCell className="text-xs sm:text-sm">{alert.condition}</TableCell>
              <TableCell className="text-xs sm:text-sm">
                {formatDistanceToNow(new Date(alert.createdAt), { addSuffix: true })}
              </TableCell>
              <TableCell>
                <Switch
                  checked={alert.status === "Active"}
                  onCheckedChange={() => {
                    // In a real app, this would update the alert status via API
                    console.log(`Toggle alert ${alert.id}`)
                  }}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
