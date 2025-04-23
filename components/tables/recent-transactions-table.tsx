"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatDistanceToNow } from "date-fns"
import { ExternalLink, RefreshCw } from "lucide-react"
import Link from "next/link"

interface Transaction {
  id: string
  signature: string
  blockTime: string
  status: string
  fee: string
  sender: string
  receiver: string
  programType?: string
}

interface RecentTransactionsTableProps {
  transactions: Transaction[]
  isLoading?: boolean
}

export function RecentTransactionsTable({ transactions, isLoading = false }: RecentTransactionsTableProps) {
  // If no transactions, show placeholder data
  const data = transactions.length > 0 ? transactions : []

  const formatSignature = (signature: string) => {
    if (signature.length > 12) {
      return `${signature.substring(0, 6)}...${signature.substring(signature.length - 6)}`
    }
    return signature
  }

  const formatAddress = (address: string) => {
    if (address === "Multiple" || address === "Unknown") return address
    if (address.length > 12) {
      return `${address.substring(0, 6)}...${address.substring(address.length - 6)}`
    }
    return address
  }

  return (
    <div className="w-full overflow-auto">
      {isLoading && (
        <div className="flex justify-center items-center py-2">
          <RefreshCw className="h-4 w-4 animate-spin text-primary mr-2" />
          <span className="text-sm text-muted-foreground">Refreshing data...</span>
        </div>
      )}

      <Table className="min-w-[800px]">
        <TableHeader>
          <TableRow>
            <TableHead>Signature</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Fee</TableHead>
            <TableHead>Sender</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                No transactions found
              </TableCell>
            </TableRow>
          ) : (
            data.map((tx) => (
              <TableRow key={tx.id}>
                <TableCell className="font-mono text-xs sm:text-sm">
                  <Link href={`/tx/${tx.signature}`} className="hover:text-primary hover:underline">
                    {formatSignature(tx.signature)}
                  </Link>
                </TableCell>
                <TableCell className="text-xs sm:text-sm">
                  {formatDistanceToNow(new Date(tx.blockTime), { addSuffix: true })}
                </TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      tx.status === "Success"
                        ? "bg-success/10 text-success dark:bg-success/20 dark:text-success-foreground"
                        : "bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive-foreground"
                    }`}
                  >
                    {tx.status}
                  </span>
                </TableCell>
                <TableCell className="text-xs sm:text-sm">{tx.fee}</TableCell>
                <TableCell className="font-mono text-xs sm:text-sm">
                  <Link href={`/account/${tx.sender}`} className="hover:text-primary hover:underline">
                    {formatAddress(tx.sender)}
                  </Link>
                </TableCell>
                <TableCell className="text-xs sm:text-sm">{tx.programType || "Unknown"}</TableCell>
                <TableCell>
                  <Link href={`/tx/${tx.signature}`} className="text-muted-foreground hover:text-primary">
                    <ExternalLink className="h-4 w-4" />
                    <span className="sr-only">View Transaction Details</span>
                  </Link>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
