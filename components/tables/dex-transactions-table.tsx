"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatDistanceToNow } from "date-fns"
import { ExternalLink } from "lucide-react"

interface DexTransaction {
  id: string
  signature: string
  blockTime: string
  dex: string
  fromToken: string
  toToken: string
  fromAmount: string
  toAmount: string
}

interface DexTransactionsTableProps {
  transactions: DexTransaction[]
}

export function DexTransactionsTable({ transactions }: DexTransactionsTableProps) {
  // If no transactions, show placeholder data
  const data =
    transactions.length > 0
      ? transactions
      : [
          {
            id: "1",
            signature: "5Vxj8X...dKLmB",
            blockTime: "2023-04-15T10:30:00Z",
            dex: "Jupiter",
            fromToken: "SOL",
            toToken: "USDC",
            fromAmount: "10.5 SOL",
            toAmount: "1,050 USDC",
          },
          {
            id: "2",
            signature: "2RtYp7...qWzXc",
            blockTime: "2023-04-15T10:29:45Z",
            dex: "Orca",
            fromToken: "USDC",
            toToken: "SOL",
            fromAmount: "500 USDC",
            toAmount: "5 SOL",
          },
          {
            id: "3",
            signature: "8KjLm...pQrSt",
            blockTime: "2023-04-15T10:29:30Z",
            dex: "Raydium",
            fromToken: "SOL",
            toToken: "BONK",
            fromAmount: "2 SOL",
            toAmount: "25,000,000 BONK",
          },
          {
            id: "4",
            signature: "3VbNm...xYzAb",
            blockTime: "2023-04-15T10:29:15Z",
            dex: "Jupiter",
            fromToken: "USDT",
            toToken: "SOL",
            fromAmount: "1,000 USDT",
            toAmount: "10 SOL",
          },
          {
            id: "5",
            signature: "9QwEr...tYuIo",
            blockTime: "2023-04-15T10:29:00Z",
            dex: "Orca",
            fromToken: "SOL",
            toToken: "mSOL",
            fromAmount: "20 SOL",
            toAmount: "19.8 mSOL",
          },
        ]

  return (
    <div className="w-full overflow-auto">
      <Table className="min-w-[700px]">
        <TableHeader>
          <TableRow>
            <TableHead>Signature</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>DEX</TableHead>
            <TableHead>From</TableHead>
            <TableHead>To</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((tx) => (
            <TableRow key={tx.id}>
              <TableCell className="font-mono text-xs sm:text-sm">{tx.signature}</TableCell>
              <TableCell className="text-xs sm:text-sm">
                {formatDistanceToNow(new Date(tx.blockTime), { addSuffix: true })}
              </TableCell>
              <TableCell className="text-xs sm:text-sm">{tx.dex}</TableCell>
              <TableCell className="text-xs sm:text-sm">
                {tx.fromAmount} {tx.fromToken}
              </TableCell>
              <TableCell className="text-xs sm:text-sm">
                {tx.toAmount} {tx.toToken}
              </TableCell>
              <TableCell>
                <a
                  href={`https://solscan.io/tx/${tx.signature}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span className="sr-only">View on Solscan</span>
                </a>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
