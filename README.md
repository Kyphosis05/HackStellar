# BlockSocial

A decentralized social media platform built on the Stellar blockchain with Soroban smart contracts that enables content creators to receive cryptocurrency donations, organize challenges, and trade creator tokens.

## Features

### 🔐 Stellar Wallet Integration
- Connect your Freighter wallet to interact with the platform
- View your XLM balance in real-time
- Demo mode available for testing without a wallet

### 📱 Social Feed
- Create and share posts with the community
- Like and comment on content
- Follow your favorite creators

### 💰 Donation System (Soroban Smart Contract)
- Send XLM donations directly to content creators via smart contracts
- Transparent on-chain donation tracking
- Quick donation amounts (10, 25, 50, 100 XLM)
- Optional message support with donations
- All donations recorded permanently on blockchain

### 🏆 Challenges (Soroban Smart Contract)
- Participate in creator challenges managed by smart contracts
- Create your own challenges with XLM prize pools locked in contract
- Track active and completed challenges on-chain
- Automatic trustless reward distribution to winners
- Verifiable challenge outcomes

### 🛍️ Token Marketplace
- Discover creator tokens
- View token prices and 24h price changes
- Trade creator tokens with XLM
- Track your token portfolio

### 📊 Live Crypto Prices
- Real-time cryptocurrency price tracking
- Support for major cryptocurrencies (BTC, ETH, XLM, USDC, etc.)
- 24-hour price change indicators

## Technologies Used

- **Framework**: Next.js 16 with App Router
- **Blockchain**: Stellar Network with Soroban Smart Contracts
- **Smart Contracts**: Rust + Soroban SDK
- **Wallet**: Freighter Wallet Integration
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **SDK**: @stellar/stellar-sdk

## Smart Contracts

This platform uses Soroban smart contracts for core features:

### Donation Contract
- On-chain donation tracking
- Transparent transaction history
- Automatic token transfers
- Message storage with donations

### Challenge Contract
- Prize pool locking mechanism
- Participant registration
- Automated winner selection
- Trustless prize distribution

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Rust toolchain (for building contracts)
- Soroban CLI (`stellar` command)
- (Optional) Freighter Wallet browser extension

### Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd blocksocial
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Build smart contracts (optional - pre-built contracts included):
\`\`\`bash
# Install Rust if not already installed
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Add wasm target
rustup target add wasm32-unknown-unknown

# Build contracts
cd contracts/donation
cargo build --target wasm32-unknown-unknown --release

cd ../challenge
cargo build --target wasm32-unknown-unknown --release
\`\`\`

4. Deploy smart contracts to Stellar testnet:
\`\`\`bash
# Set your Stellar secret key
export STELLAR_SECRET_KEY="YOUR_SECRET_KEY"

# Run deployment script
npm run deploy:contracts
\`\`\`

5. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Contract Deployment

The platform requires two smart contracts to be deployed:

1. **Donation Contract**: Handles creator donations
2. **Challenge Contract**: Manages challenges and prizes

### Deploy Contracts

\`\`\`bash
# Install dependencies
npm install

# Set environment variable with your Stellar secret key
export STELLAR_SECRET_KEY="S..."

# Deploy contracts to testnet
npm run deploy:contracts
\`\`\`

This will:
1. Upload contract WASM bytecode to Stellar
2. Deploy contract instances
3. Initialize contracts
4. Save contract IDs to `contract-ids.json`

### Environment Variables

Create a `.env.local` file:

\`\`\`env
NEXT_PUBLIC_DONATION_CONTRACT_ID=C...
NEXT_PUBLIC_CHALLENGE_CONTRACT_ID=C...
STELLAR_SECRET_KEY=S...
\`\`\`

## Wallet Connection

### Using Demo Mode
If you don't have Freighter Wallet installed, the platform automatically switches to demo mode with:
- Test wallet address
- 1000.50 XLM demo balance
- Simulated transactions (no blockchain interaction)

### Using Real Wallet
1. Install [Freighter Wallet](https://www.freighter.app/) browser extension
2. Create or import a Stellar wallet
3. Get testnet XLM from [Stellar Laboratory](https://laboratory.stellar.org/#account-creator?network=test)
4. Click "Connect Wallet" on BlockSocial
5. Approve the connection in Freighter

## How Smart Contracts Work

### Making Donations
1. User clicks "Donate" on a post
2. Frontend calls the Donation smart contract
3. Contract verifies authorization
4. Tokens are transferred from donor to creator
5. Donation record is stored on-chain
6. Transaction is confirmed on Stellar network

### Creating Challenges
1. User creates a challenge with prize pool
2. Frontend calls Challenge smart contract
3. Prize pool XLM is locked in the contract
4. Challenge is stored on-chain with all details
5. Other users can join the challenge
6. Winner receives prize automatically from contract

## Project Structure

\`\`\`
blocksocial/
├── contracts/
│   ├── donation/              # Donation smart contract (Rust)
│   │   ├── src/lib.rs
│   │   └── Cargo.toml
│   └── challenge/             # Challenge smart contract (Rust)
│       ├── src/lib.rs
│       └── Cargo.toml
├── scripts/
│   └── deploy-contracts.ts    # Contract deployment script
├── app/
│   ├── page.tsx              # Homepage with crypto prices
│   ├── feed/                 # Social feed
│   ├── challenges/           # Challenges page
│   ├── marketplace/          # Token marketplace
│   └── api/                  # API routes
├── components/
│   ├── navbar.tsx
│   ├── wallet-connect-button.tsx
│   ├── donate-dialog.tsx
│   └── ...
├── lib/
│   ├── stellar.ts            # Stellar SDK integration
│   └── soroban.ts            # Soroban smart contract integration
├── contract-ids.json         # Deployed contract IDs
└── README.md
\`\`\`

## Important Notes

- This platform uses Stellar testnet for development
- Smart contracts are immutable once deployed
- All transactions require XLM for transaction fees
- Demo mode simulates transactions without blockchain interaction
- For production, deploy contracts to Stellar mainnet

## Smart Contract Security

- All contracts use `require_auth()` for authorization
- Prize pools are locked in contracts until winner is selected
- On-chain verification of all transactions
- No central authority can modify donations or challenge outcomes
- All code is open source and auditable

## Development Commands

\`\`\`bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Deploy smart contracts
npm run deploy:contracts

# Build smart contracts
cd contracts/donation && cargo build --release
cd contracts/challenge && cargo build --release
\`\`\`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

When contributing smart contracts:
1. Write comprehensive tests
2. Follow Rust best practices
3. Document all public functions
4. Ensure contracts are optimized for gas efficiency

## Security Considerations

- Never share your wallet private keys
- Always verify transaction details before confirming
- Use testnet for development and testing
- Keep your Freighter wallet extension updated
- Audit smart contracts before mainnet deployment
- Test all contract functions thoroughly on testnet

## License

This project is open source and available under the MIT License.

## Support

For issues and questions, please open an issue on the repository.

---

Built with ❤️ on the Stellar Network with Soroban Smart Contracts
\`\`\`

```json file="" isHidden
