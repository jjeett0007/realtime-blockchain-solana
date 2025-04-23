"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatDistanceToNow } from "date-fns"
import { ExternalLink } from "lucide-react"
import Link from "next/link"

interface TokenFlow {
  id: string
  signature: string
  blockTime: string
  token: string
  amount: string
  sender: string
  receiver: string
  senderType: string
  receiverType: string
}

interface TokenFlowTableProps {
  flows: TokenFlow[]
}

export function TokenFlowTable({ flows }: TokenFlowTableProps) {
  // If no flows, show placeholder data
  const data =
    flows.length > 0
      ? flows
      : [
          {
            id: "1",
            signature: "5Vxj8X...dKLmB",
            blockTime: "2023-04-15T10:30:00Z",
            token: "SOL",
            amount: "25,000 SOL",
            sender: "7YWH...3Pds",
            receiver: "3xTR...9Qwe",
            senderType: "Whale",
            receiverType: "CEX",
          },
          {
            id: "2",
            signature: "2RtYp7...qWzXc",
            blockTime: "2023-04-15T09:45:00Z",
            token: "USDC",
            amount: "1,500,000 USDC",
            sender: "5Gtr...7Yhj",
            receiver: "9Plm...2Rty",
            senderType: "CEX",
            receiverType: "Whale",
          },
          {
            id: "3",
            signature: "8KjLm...pQrSt",
            blockTime: "2023-04-15T08:20:00Z",
            token: "SOL",
            amount: "18,500 SOL",
            sender: "2Wer...8Iop",
            receiver: "6Yhn...4Rty",
            senderType: "Whale",
            receiverType: "DEX",
          },
          {
            id: "4",
            signature: "3VbNm...xYzAb",
            blockTime: "2023-04-15T07:15:00Z",
            token: "USDT",
            amount: "2,000,000 USDT",
            sender: "8Uio...1Asd",
            receiver: "4Fgh...7Jkl",
            senderType: "CEX",
            receiverType: "Protocol",
          },
          {
            id: "5",
            signature: "9QwEr...tYuIo",
            blockTime: "2023-04-15T06:30:00Z",
            token: "SOL",
            amount: "12,000 SOL",
            sender: "1Zxc...3Vbn",
            receiver: "5Asd...9Fgh",
            senderType: "Whale",
            receiverType: "Whale",
          },
        ]

  return (
    <div className="w-full overflow-auto">
      <Table className="min-w-[800px]">
        <TableHeader>
          <TableRow>
            <TableHead>Signature</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Token</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>From</TableHead>
            <TableHead>To</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((flow) => (
            <TableRow key={flow.id}>
              <TableCell className="font-mono text-xs sm:text-sm">{flow.signature}</TableCell>
              <TableCell className="text-xs sm:text-sm">
                {formatDistanceToNow(new Date(flow.blockTime), { addSuffix: true })}
              </TableCell>
              <TableCell className="text-xs sm:text-sm">{flow.token}</TableCell>
              <TableCell className="font-medium text-xs sm:text-sm">{flow.amount}</TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <Link
                    href={`/account/${flow.sender}`}
                    className="font-mono text-xs sm:text-sm hover:text-primary hover:underline"
                  >
                    {flow.sender}
                  </Link>
                  <span className="text-xs text-muted-foreground">{flow.senderType}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <Link
                    href={`/account/${flow.receiver}`}
                    className="font-mono text-xs sm:text-sm hover:text-primary hover:underline"
                  >
                    {flow.receiver}
                  </Link>
                  <span className="text-xs text-muted-foreground">{flow.receiverType}</span>
                </div>
              </TableCell>
              <TableCell>
                <a
                  href={`https://solscan.io/tx/${flow.signature}`}
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
