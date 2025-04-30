
# 🛰️ JET SCAN MONITOR

**JET SCAN MONITOR** is a real-time Solana blockchain monitoring dashboard built entirely on the frontend using Solscan APIs. Designed for the **Solscan Monitoring Masters Hackathon**, it provides actionable insights into whale transactions, DeFi protocol activity, and wallet-level intelligence — all without a backend server.

---

## 🚀 Features

### 🔄 Latest Block Transactions
- Real-time feed of the most recent transactions on Solana.
- Quickly access transaction IDs, token transfers, and involved accounts.

### 🐋 Whale Activity Tracking
- Detect and display high-volume transfers involving:
  - **USDT**
  - **USDC**
- Includes:
  - Whale wallet addresses
  - Transfer amounts
  - Associated charts showing trends and volume changes

### 📊 Whale Analytics
- Charts and summaries showing:
  - Active whale wallets
  - USDT/USDC volume trends
  - Top token transfers

### 💸 DeFi Monitoring
- Tracks transactions and activity types from major Solana DeFi protocols:
  - **Pump.fun**
  - **Raydium**
  - **Jupiter**
  - **Orca**
- Shows:
  - Transaction type (swap, mint, etc.)
  - Token addresses
  - Transaction IDs
  - Transfer amounts

### 👤 Wallet Account Page
- Enter any wallet address to view:
  - Wallet account type
  - Recent token transfers
  - DeFi activities involving the wallet
  - All associated token accounts

### 📑 Transaction Detail Page
- Detailed, human-readable breakdown of a transaction:
  - Timestamp
  - Fee
  - Token transfers
  - Instructions with decoded descriptions
  - Accounts involved and balance changes
  - Logs for deeper inspection

---

## 🧰 Built With

- **Next.js** – Frontend framework
- **Tailwind CSS** – Styling
- **Solscan Public API** – Real-time and historical blockchain data
- **Chart.js / ApexCharts** – Interactive data visualizations

> 🔒 No backend server — all logic is processed client-side.

---

## 📦 Solscan API Endpoints Used

- `/transaction/tx` – Get full transaction info
- `/account/tokens` – Get wallet token holdings
- `/account/info` – Get wallet account metadata
- `/transaction/token` – Token transfer history
- `/market/token` – Token metadata
- `/block/last` – Latest block hash
- `/block/txs` – Transactions from recent blocks

---

## 🎯 Purpose & Benefits

- Proves how **Solana's data layer is accessible** using just frontend tools.
- Helps **developers, analysts, and users** understand whale and DeFi activity.
- Promotes **on-chain transparency** without needing a complex backend setup.

---

## 🔗 Live Demo

Visit: [https://jet-scan.vercel.app](https://jet-scan.vercel.app)

---

## 🧪 Local Development

```bash
# Clone the repo
git clone https://github.com/your-username/jet-scan-monitor.git
cd jet-scan-monitor

# Install dependencies
npm install

# Add your Solscan API key
echo "NEXT_PUBLIC_SOLSCAN_API_KEY=your_key_here" > .env.local

# Start the development server
npm run dev
```

---

## 📁 Project Structure

```
├── components/         # UI components (wallet cards, charts, tables)
├── pages/              # Route-based views (/, /tx/[id], /account/[address])
├── utils/              # API clients and helper functions
├── public/             # Static assets
├── styles/             # Global and Tailwind CSS styles
└── README.md
```

---

## 📽️ Optional Video Walkthrough


---

## 🛡️ License

MIT © [JET]
```
