// API service for the JET SCAN Monitor
// This file contains functions to fetch data from the Solscan API and CoinGecko

// Base URL for the Solscan API
const API_BASE_URL = "https://pro-api.solscan.io/v2.0"
// Base URL for CoinGecko API
const COINGECKO_API_URL = "https://api.coingecko.com/api/v3"

const DEFAULT_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjcmVhdGVkQXQiOjE3NDM1MDkzMTI1MjgsImVtYWlsIjoiamplZXR0MDAwMDdAZ21haWwuY29tIiwiYWN0aW9uIjoidG9rZW4tYXBpIiwiYXBpVmVyc2lvbiI6InYyIiwiaWF0IjoxNzQzNTA5MzEyfQ.GjtrzJmSbzbEJTjOw-N6kn6_o_7IjRcsg99Xc3Svz_8"

// Token addresses
export const TOKEN_ADDRESSES = {
  SOL: "So11111111111111111111111111111111111111112",
  USDC: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  USDT: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
}

// Default headers for API requests
const getHeaders = (apiKey: string) => ({
  token: apiKey,
})

// Fetch recent transactions
export async function fetchRecentTransactions() {
  try {
    const response = await fetch(`${API_BASE_URL}/transaction/last?limit=10&filter=exceptVote&`, {
      method: "GET",
      headers: getHeaders(DEFAULT_API_KEY),
    })

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    const data = await response.json()

    if (data.success && data.data) {
      // Transform the API response to match our expected format
      return data.data.map((tx: any) => ({
        id: tx.tx_hash.substring(0, 8),
        signature: tx.tx_hash,
        blockTime: tx.time,
        status: tx.status,
        fee: `${(tx.fee / 1000000).toFixed(6)} SOL`,
        sender: tx.signer ? tx.signer[0] : "Unknown",
        receiver: "Multiple", // Simplified as transactions often have multiple receivers
        programType: tx.parsed_instructions && tx.parsed_instructions[0] ? tx.parsed_instructions[0].type : "Unknown",
      }))
    }

    return []
  } catch (error) {
    console.error("Error fetching recent transactions:", error)
    return []
  }
}

// Fetch Solana price from CoinGecko
export async function fetchSolanaPrice() {
  try {
    const response = await fetch(
      `${COINGECKO_API_URL}/simple/price?ids=solana&vs_currencies=usd&include_24hr_change=true`,
    )

    if (!response.ok) {
      throw new Error(`CoinGecko API request failed with status ${response.status}`)
    }

    const data = await response.json()

    if (data && data.solana) {
      return {
        price: data.solana.usd,
        priceChange: data.solana.usd_24h_change,
      }
    }

    return { price: 0, priceChange: 0 }
  } catch (error) {
    console.error("Error fetching Solana price:", error)
    return { price: 0, priceChange: 0 }
  }
}

// Fetch general Solana stats
export async function fetchSolanaStats() {
  try {
    // Fetch real price data from CoinGecko
    const priceData = await fetchSolanaPrice()

    // For now, we'll use mock data for other stats
    // In a real app, these would come from the Solscan API
    return {
      price: priceData.price,
      priceChange: priceData.priceChange,
      tps: 2500,
      blockTime: 0.4,
      marketCap: (priceData.price * 555000000) / 1000000000, // Approximate market cap based on circulating supply
    }
  } catch (error) {
    console.error("Error fetching Solana stats:", error)
    // Return fallback data if API call fails
    return {
      price: 100.25,
      priceChange: 2.5,
      tps: 2500,
      blockTime: 0.4,
      marketCap: 42.5,
    }
  }
}

// Fetch USDC whale transactions
export async function fetchUSDCWhaleTransactions() {
  try {
    const requestOptions = {
      method: "GET",
      headers: getHeaders(DEFAULT_API_KEY),
    }

    const response = await fetch(
      `${API_BASE_URL}/token/transfer?address=${TOKEN_ADDRESSES.USDC}&amount[]=10000000&page=1&page_size=10&sort_by=block_time&sort_order=desc`,
      requestOptions,
    )

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    const data = await response.json()

    if (data.success && data.data) {
      // Get token metadata from the response
      const tokenMetadata = data.metadata?.tokens?.[TOKEN_ADDRESSES.USDC] || {
        token_name: "USDC",
        token_symbol: "USDC",
        token_icon: "",
      }

      // Transform the API response to match our expected format
      return data.data.map((tx: any) => {
        // Format amount based on token decimals (6 for USDC)
        const decimals = tx.token_decimals || 6
        const formattedAmount = `${(tx.amount / Math.pow(10, decimals)).toLocaleString()} ${tokenMetadata.token_symbol}`

        return {
          id: `usdc-${tx.trans_id ? tx.trans_id.substring(0, 8) : Math.random().toString(36).substring(2, 10)}`,
          signature: tx.trans_id,
          blockTime: tx.time || tx.block_time,
          amount: formattedAmount,
          value: tx.value ? `$${Number(tx.value).toLocaleString()}` : undefined,
          token: tokenMetadata.token_symbol,
          tokenIcon: tokenMetadata.token_icon,
          sender: tx.from_address || "Unknown",
          receiver: tx.to_address || "Unknown",
          fromTokenAccount: tx.from_token_account,
          toTokenAccount: tx.to_token_account,
          activityType: tx.activity_type,
        }
      })
    }

    return []
  } catch (error) {
    console.error(`Error fetching USDC whale transactions:`, error)
    return []
  }
}

// Add a new function to fetch USDT whale transactions
export async function fetchUSDTWhaleTransactions() {
  try {
    const requestOptions = {
      method: "GET",
      headers: getHeaders(DEFAULT_API_KEY),
    }

    const response = await fetch(
      `${API_BASE_URL}/token/transfer?address=${TOKEN_ADDRESSES.USDT}&amount[]=10000000&page=1&page_size=10&sort_by=block_time&sort_order=desc`,
      requestOptions,
    )

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    const data = await response.json()

    if (data.success && data.data) {
      // Get token metadata from the response
      const tokenMetadata = data.metadata?.tokens?.[TOKEN_ADDRESSES.USDT] || {
        token_name: "USDT",
        token_symbol: "USDT",
        token_icon: "",
      }

      // Transform the API response to match our expected format
      return data.data.map((tx: any) => {
        // Format amount based on token decimals (6 for USDT)
        const decimals = tx.token_decimals || 6
        const formattedAmount = `${(tx.amount / Math.pow(10, decimals)).toLocaleString()} ${tokenMetadata.token_symbol}`

        return {
          id: `usdt-${tx.trans_id ? tx.trans_id.substring(0, 8) : Math.random().toString(36).substring(2, 10)}`,
          signature: tx.trans_id,
          blockTime: tx.time || tx.block_time,
          amount: formattedAmount,
          value: tx.value ? `$${Number(tx.value).toLocaleString()}` : undefined,
          token: tokenMetadata.token_symbol,
          tokenIcon: tokenMetadata.token_icon,
          sender: tx.from_address || "Unknown",
          receiver: tx.to_address || "Unknown",
          fromTokenAccount: tx.from_token_account,
          toTokenAccount: tx.to_token_account,
          activityType: tx.activity_type,
        }
      })
    }

    return []
  } catch (error) {
    console.error(`Error fetching USDT whale transactions:`, error)
    return []
  }
}

// Update the fetchWhaleTransactions function to handle "all" tokens properly
export async function fetchWhaleTransactions(selectedToken = "all") {
  try {
    // If a specific token is selected, use the dedicated function
    const tokenHandlers: Record<string, () => Promise<any>> = {
      [TOKEN_ADDRESSES.USDC]: fetchUSDCWhaleTransactions,
      [TOKEN_ADDRESSES.USDT]: fetchUSDTWhaleTransactions,
      [TOKEN_ADDRESSES.SOL]: async () => {
        const amount = 100000 * 1000000000 // 100,000 SOL (in lamports)
        return fetchTokenWhaleTransactions(TOKEN_ADDRESSES.SOL, amount)
      },
    }

    if (tokenHandlers[selectedToken]) {
      const txData = await tokenHandlers[selectedToken]()

      const simplifiedTransactions = txData.map((tx: { id: any; sender: any; amount: any; token: any; blockTime: any }) => ({
        id: tx.id,
        address: tx.sender,
        balance: tx.amount,
        tokens: tx.token,
        value: tx.token,
        lastActivity: tx.blockTime,
      }))

      return {
        txData,
        address: simplifiedTransactions,
      }
    }

    // For "all", fetch both USDC and USDT transactions and combine them
    if (selectedToken === "all") {
      try {
        // Fetch transactions for USDC and USDT concurrently
        const tokenTransactions = await Promise.allSettled([
          fetchUSDCWhaleTransactions(),
          fetchUSDTWhaleTransactions(),
        ])

        // Extract fulfilled results and flatten into a single array
        const allTransactions = tokenTransactions
          .filter(result => result.status === "fulfilled")
          .flatMap(result => (result as PromiseFulfilledResult<any[]>).value)

        // Sort by time (newest first) and limit to 10 transactions
        const sortedTransactions = allTransactions
          .sort((a, b) => new Date(b.blockTime).getTime() - new Date(a.blockTime).getTime())
          .slice(0, 10)

        // Simplify transactions for address data
        const simplifiedTransactions = sortedTransactions.map(tx => ({
          id: tx.id,
          address: tx.sender,
          balance: tx.amount,
          tokens: tx.token,
          value: tx.token,
          lastActivity: tx.blockTime,
        }))

        return {
          txData: sortedTransactions,
          address: simplifiedTransactions,
        }
      } catch (error) {
        console.error("Error fetching all token transactions:", error)
        return []
      }
    }

    // If we get here, it's an unknown token
    return []
  } catch (error) {
    console.error("Error fetching whale transactions:", error)
    return []
  }
}

// Generic function for other tokens (SOL, USDT)
export async function fetchTokenWhaleTransactions(tokenAddress: string, minAmount: number) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/token/transfer?address=${tokenAddress}&amount[]=${minAmount}&page=1&page_size=10&sort_by=block_time&sort_order=desc`,
      {
        method: "GET",
        headers: getHeaders(DEFAULT_API_KEY),
      },
    )

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    const data = await response.json()

    if (data.success && data.data) {
      // Transform the API response to match our expected format
      return data.data.map((tx: any) => {
        // Determine token symbol based on address
        let tokenSymbol = "Unknown"
        let decimals = 9 // Default for SOL

        if (tokenAddress === TOKEN_ADDRESSES.SOL) {
          tokenSymbol = "SOL"
          decimals = 9
        } else if (tokenAddress === TOKEN_ADDRESSES.USDC) {
          tokenSymbol = "USDC"
          decimals = 6
        } else if (tokenAddress === TOKEN_ADDRESSES.USDT) {
          tokenSymbol = "USDT"
          decimals = 6
        }

        // Format amount based on token decimals
        const formattedAmount = `${(tx.amount / Math.pow(10, decimals)).toLocaleString()} ${tokenSymbol}`

        return {
          id: `${tokenSymbol.toLowerCase()}-${tx.trans_id ? tx.trans_id.substring(0, 8) : Math.random().toString(36).substring(2, 10)}`,
          signature: tx.trans_id,
          blockTime: tx.time || tx.block_time,
          amount: formattedAmount,
          value: tx.value ? `$${Number(tx.value).toLocaleString()}` : undefined,
          token: tokenSymbol,
          sender: tx.from_address || "Unknown",
          receiver: tx.to_address || "Unknown",
        }
      })
    }

    return []
  } catch (error) {
    console.error(`Error fetching ${tokenAddress} whale transactions:`, error)
    return []
  }
}

// Fetch whale wallets
export async function fetchWhaleWallets() {
  // Mock data - in a real app, this would call the Solscan API
  return [
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
}

// Fetch DEX transactions
export async function fetchDexTransactions(dex = "all") {
  // Mock data - in a real app, this would call the Solscan API
  const allTransactions = [
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

  if (dex === "all") {
    return allTransactions
  }

  return allTransactions.filter((tx) => tx.dex.toLowerCase() === dex.toLowerCase())
}

// Fetch liquidity pools
export async function fetchLiquidityPools(dex = "all") {
  // Mock data - in a real app, this would call the Solscan API
  const allPools = [
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

  if (dex === "all") {
    return allPools
  }

  return allPools.filter((pool) => pool.dex.toLowerCase() === dex.toLowerCase())
}

// Fetch token flows
export async function fetchTokenFlows() {
  // Mock data - in a real app, this would call the Solscan API
  return [
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
}
