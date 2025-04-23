"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ExternalLink } from "lucide-react"
import Link from "next/link"

interface WhaleWallet {
  id: string
  address: string
  balance: string
  value: string
  tokens: number
  lastActivity: string
}

interface WhaleWalletsTableProps {
  wallets: WhaleWallet[]
}

export function WhaleWalletsTable({ wallets }: WhaleWalletsTableProps) {
  // If no wallets, show placeholder data
  const data =
    wallets.length > 0
      ? wallets
      : [
          {
            id: "1",
            address: "7YWH...3Pds",
            balance: "1,250,000 SOL",
            value: "$125,000,000",
            tokens: 15,
            lastActivity: "2 hours ago",
          },
          {
            id: "2",
            address: "5Gtr...7Yhj",
            balance: "950,000 SOL",
            value: "$95,000,000",
            tokens: 28,
            lastActivity: "5 hours ago",
          },
          {
            id: "3",
            address: "2Wer...8Iop",
            balance: "820,000 SOL",
            value: "$82,000,000",
            tokens: 42,
            lastActivity: "1 day ago",
          },
          {
            id: "4",
            address: "8Uio...1Asd",
            balance: "750,000 SOL",
            value: "$75,000,000",
            tokens: 19,
            lastActivity: "3 days ago",
          },
          {
            id: "5",
            address: "1Zxc...3Vbn",
            balance: "680,000 SOL",
            value: "$68,000,000",
            tokens: 31,
            lastActivity: "1 week ago",
          },
        ]

  return (
    <div className="w-full overflow-auto">
      <Table className="min-w-[700px]">
        <TableHeader>
          <TableRow>
            <TableHead>Address</TableHead>
            <TableHead>Balance</TableHead>
            <TableHead>Value (USD)</TableHead>
            <TableHead>Tokens</TableHead>
            <TableHead>Last Activity</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((wallet) => (
            <TableRow key={wallet.id}>
              <TableCell className="font-mono text-xs sm:text-sm">
                <Link href={`/account/${wallet.address}`} className="hover:text-primary hover:underline">
                  {wallet.address}
                </Link>
              </TableCell>
              <TableCell className="font-medium text-xs sm:text-sm">{wallet.balance}</TableCell>
              <TableCell className="text-xs sm:text-sm">{wallet.value}</TableCell>
              <TableCell className="text-xs sm:text-sm">{wallet.tokens}</TableCell>
              <TableCell className="text-xs sm:text-sm">{wallet.lastActivity}</TableCell>
              <TableCell>
                <a
                  href={`https://solscan.io/account/${wallet.address}`}
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
