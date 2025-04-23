"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatDistanceToNow } from "date-fns"
import { ExternalLink, RefreshCw } from "lucide-react"
import Link from "next/link"
import { formatAddress } from "../useables/formatAddress"

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

interface WhaleTransactionsTableProps {
  transactions: WhaleTransaction[]
  isLoading?: boolean
}

export function WhaleTransactionsTable({ transactions = [], isLoading = false }: WhaleTransactionsTableProps) {
  // If no transactions, show placeholder data
  const data = transactions.length > 0 ? transactions : []

  const formatSignature = (signature: string) => {
    if (signature.length > 12) {
      return `${signature.substring(0, 6)}...${signature.substring(signature.length - 6)}`
    }
    return signature
  }



  return (
    <div className="w-full overflow-auto">
      {isLoading && (
        <div className="flex justify-center items-center py-2">
          <RefreshCw className="h-4 w-4 animate-spin text-tertiary mr-2" />
          <span className="text-sm text-muted-foreground">Refreshing data...</span>
        </div>
      )}

      <Table className="min-w-[800px]">
        <TableHeader>
          <TableRow>
            <TableHead>Signature</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Value (USD)</TableHead>
            <TableHead>Token</TableHead>
            <TableHead>Sender</TableHead>
            <TableHead>Receiver</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center">
                {isLoading ? (
                  <div className="flex justify-center items-center">
                    <RefreshCw className="h-4 w-4 animate-spin text-tertiary mr-2" />
                    <span>Loading transactions...</span>
                  </div>
                ) : (
                  <span>No whale transactions found</span>
                )}
              </TableCell>
            </TableRow>
          ) : (
            data.map((tx) => (
              <TableRow key={tx.id}>
                <TableCell className="font-mono text-xs sm:text-sm">
                  <Link href={`/tx/${tx.signature}`} className="hover:text-tertiary hover:underline">
                    {formatSignature(tx.signature)}
                  </Link>
                </TableCell>
                <TableCell className="text-xs sm:text-sm">
                  {formatDistanceToNow(new Date(tx.blockTime), { addSuffix: true })}
                </TableCell>
                <TableCell className="font-medium text-xs sm:text-sm">{tx.amount}</TableCell>
                <TableCell className="text-xs sm:text-sm">{tx.value || "N/A"}</TableCell>
                <TableCell className="text-xs sm:text-sm">
                  <div className="flex items-center gap-1">
                    {tx.tokenIcon && (
                      <div className="w-4 h-4 relative mr-1">
                        <img
                          src={tx.tokenIcon || "/placeholder.svg"}
                          alt={tx.token}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            // Hide broken images
                            ;(e.target as HTMLImageElement).style.display = "none"
                          }}
                        />
                      </div>
                    )}
                    {tx.token}
                  </div>
                </TableCell>
                <TableCell className="font-mono text-xs sm:text-sm">
                  <Link href={`/account/${tx.sender}`} className="hover:text-primary hover:underline">
                    {formatAddress(tx.sender)}
                  </Link>
                </TableCell>
                <TableCell className="font-mono text-xs sm:text-sm">
                  <Link href={`/account/${tx.receiver}`} className="hover:text-primary hover:underline">
                    {formatAddress(tx.receiver)}
                  </Link>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-1">
                    <Link href={`/tx/${tx.signature}`} className="text-muted-foreground hover:text-tertiary">
                      <ExternalLink className="h-4 w-4" />
                      <span className="sr-only">View Transaction Details</span>
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
