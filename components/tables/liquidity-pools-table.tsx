"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ExternalLink } from "lucide-react"

interface LiquidityPool {
  id: string
  address: string
  dex: string
  pair: string
  liquidity: string
  volume24h: string
  apy: string
}

interface LiquidityPoolsTableProps {
  pools: LiquidityPool[]
}

export function LiquidityPoolsTable({ pools }: LiquidityPoolsTableProps) {
  // If no pools, show placeholder data
  const data =
    pools.length > 0
      ? pools
      : [
          {
            id: "1",
            address: "7YWH...3Pds",
            dex: "Orca",
            pair: "SOL/USDC",
            liquidity: "$25,000,000",
            volume24h: "$3,500,000",
            apy: "12.5%",
          },
          {
            id: "2",
            address: "5Gtr...7Yhj",
            dex: "Raydium",
            pair: "SOL/USDT",
            liquidity: "$18,000,000",
            volume24h: "$2,800,000",
            apy: "10.2%",
          },
          {
            id: "3",
            address: "2Wer...8Iop",
            dex: "Orca",
            pair: "mSOL/SOL",
            liquidity: "$15,000,000",
            volume24h: "$1,200,000",
            apy: "8.7%",
          },
          {
            id: "4",
            address: "8Uio...1Asd",
            dex: "Raydium",
            pair: "BONK/SOL",
            liquidity: "$8,500,000",
            volume24h: "$4,200,000",
            apy: "22.5%",
          },
          {
            id: "5",
            address: "1Zxc...3Vbn",
            dex: "Orca",
            pair: "ETH/SOL",
            liquidity: "$12,000,000",
            volume24h: "$1,800,000",
            apy: "9.8%",
          },
        ]

  return (
    <div className="w-full overflow-auto">
      <Table className="min-w-[700px]">
        <TableHeader>
          <TableRow>
            <TableHead>Pool Address</TableHead>
            <TableHead>DEX</TableHead>
            <TableHead>Pair</TableHead>
            <TableHead>Liquidity</TableHead>
            <TableHead>24h Volume</TableHead>
            <TableHead>APY</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((pool) => (
            <TableRow key={pool.id}>
              <TableCell className="font-mono text-xs sm:text-sm">{pool.address}</TableCell>
              <TableCell className="text-xs sm:text-sm">{pool.dex}</TableCell>
              <TableCell className="text-xs sm:text-sm">{pool.pair}</TableCell>
              <TableCell className="text-xs sm:text-sm">{pool.liquidity}</TableCell>
              <TableCell className="text-xs sm:text-sm">{pool.volume24h}</TableCell>
              <TableCell className="text-xs sm:text-sm">{pool.apy}</TableCell>
              <TableCell>
                <a
                  href={`https://solscan.io/account/${pool.address}`}
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
