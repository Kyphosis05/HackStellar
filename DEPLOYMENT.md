# Smart Contract Deployment Guide

This guide explains how to deploy the Soroban smart contracts for BlockSocial.

## Prerequisites

Before deploying contracts, ensure you have:

1. **Rust Toolchain** installed:
\`\`\`bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env
\`\`\`

2. **WebAssembly Target** added:
\`\`\`bash
rustup target add wasm32-unknown-unknown
\`\`\`

3. **Stellar CLI** installed:
\`\`\`bash
cargo install --locked stellar-cli --features opt
\`\`\`

4. **Testnet Account** with XLM:
- Create account at [Stellar Laboratory](https://laboratory.stellar.org/#account-creator?network=test)
- Fund it with testnet XLM (friendbot will automatically fund it)

## Step 1: Build Smart Contracts

Navigate to each contract directory and build:

\`\`\`bash
# Build Donation Contract
cd contracts/donation
cargo build --target wasm32-unknown-unknown --release
cd ../..

# Build Challenge Contract
cd contracts/challenge
cargo build --target wasm32-unknown-unknown --release
cd ../..
\`\`\`

The compiled WASM files will be located at:
- `contracts/donation/target/wasm32-unknown-unknown/release/donation_contract.wasm`
- `contracts/challenge/target/wasm32-unknown-unknown/release/challenge_contract.wasm`

## Step 2: Set Environment Variables

Create a `.env.local` file in the project root:

\`\`\`bash
# Your Stellar testnet secret key (starts with S)
STELLAR_SECRET_KEY=S...

# These will be populated after deployment
NEXT_PUBLIC_DONATION_CONTRACT_ID=
NEXT_PUBLIC_CHALLENGE_CONTRACT_ID=
\`\`\`

**Important:** Never commit your secret key to version control!

## Step 3: Deploy Contracts

Run the deployment script:

\`\`\`bash
npm run deploy:contracts
\`\`\`

This script will:
1. Upload WASM bytecode to Stellar testnet
2. Deploy contract instances
3. Initialize both contracts
4. Save contract IDs to `contract-ids.json`

Example output:
\`\`\`
🚀 Starting Soroban contract deployment...

📦 Deploying Donation Contract...
1️⃣ Uploading WASM bytecode...
   Transaction hash: abc123...
   Waiting for confirmation...
   ✅ Transaction confirmed
✅ WASM uploaded. Hash: def456...
2️⃣ Deploying contract...
   Transaction hash: ghi789...
   Waiting for confirmation...
   ✅ Transaction confirmed
✅ Contract deployed. ID: CDONATION123...
3️⃣ Initializing contract...
   ✅ Contract initialized

📦 Deploying Challenge Contract...
[Similar output...]

✅ All contracts deployed successfully!

📝 Contract IDs:
   Donation: CDONATION123...
   Challenge: CCHALLENGE456...

💾 Contract IDs saved to contract-ids.json
\`\`\`

## Step 4: Update Environment Variables

Copy the contract IDs from `contract-ids.json` to your `.env.local`:

\`\`\`bash
NEXT_PUBLIC_DONATION_CONTRACT_ID=CDONATION123...
NEXT_PUBLIC_CHALLENGE_CONTRACT_ID=CCHALLENGE456...
\`\`\`

## Step 5: Test the Contracts

Test donations and challenges through the UI:

1. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

2. Connect your Freighter wallet

3. Try making a donation - it should use the smart contract

4. Create a challenge - prize pool will be locked in the contract

## Contract Functions

### Donation Contract

- `initialize()` - Initialize the contract (called automatically during deployment)
- `donate(donor, recipient, amount, message, token_address)` - Make a donation
- `get_donation_count()` - Get total number of donations
- `get_recipient_donations(recipient)` - Get donations for a specific creator

### Challenge Contract

- `initialize()` - Initialize the contract
- `create_challenge(creator, title, description, prize_pool, end_date, token_address)` - Create new challenge
- `join_challenge(challenge_id, participant)` - Join a challenge
- `set_winner(challenge_id, winner, token_address)` - Distribute prize to winner
- `get_challenge(challenge_id)` - Get challenge details
- `get_challenge_count()` - Get total challenges

## Troubleshooting

### "Account not found" error
- Ensure your account has testnet XLM
- Visit [Stellar Laboratory](https://laboratory.stellar.org/#account-creator?network=test) to fund it

### "Transaction failed" error
- Check that you have enough XLM for transaction fees
- Verify your secret key is correct
- Ensure the network is testnet (not mainnet)

### Contract deployment succeeds but doesn't work in UI
- Verify contract IDs are correctly set in `.env.local`
- Restart the Next.js development server after updating env vars
- Check browser console for errors

### WASM build fails
- Ensure Rust and wasm32 target are installed
- Update Rust: `rustup update`
- Clean build: `cargo clean` then rebuild

## Deploying to Mainnet

To deploy to Stellar mainnet:

1. Update `scripts/deploy-contracts.ts`:
\`\`\`typescript
const NETWORK = "PUBLIC"; // Change from "TESTNET"
const NETWORK_PASSPHRASE = StellarSDK.Networks.PUBLIC;
const HORIZON_URL = "https://horizon.stellar.org";
\`\`\`

2. Use a mainnet account with real XLM

3. Run deployment script

4. Update `.env.local` with mainnet contract IDs

**Warning:** Mainnet deployment uses real XLM. Test thoroughly on testnet first!

## Contract Updates

Smart contracts on Stellar are immutable once deployed. To update:

1. Make changes to Rust code
2. Build new WASM
3. Deploy as new contract instances
4. Update contract IDs in environment variables
5. Migrate any necessary state from old contracts

## Security Best Practices

- Never commit secret keys to version control
- Use `.env.local` for sensitive data (already in `.gitignore`)
- Test all functions thoroughly on testnet
- Audit contract code before mainnet deployment
- Keep contract code simple and well-documented
- Implement comprehensive error handling
- Use proper authorization checks (`require_auth()`)

## Gas Optimization

Soroban charges based on:
- Computation (CPU instructions)
- Memory usage
- Storage operations

Tips to reduce costs:
- Minimize storage operations
- Use efficient data structures
- Batch operations when possible
- Keep functions simple

## Monitoring Contracts

Track your deployed contracts:

1. **Stellar Expert** (Testnet): https://stellar.expert/explorer/testnet
   - Search for your contract ID
   - View all transactions
   - Monitor invocations

2. **Stellar Laboratory**: https://laboratory.stellar.org/
   - Build and test contract invocations
   - Inspect contract state

## Support

For issues with deployment:
- Check Stellar Discord: https://discord.gg/stellar
- Review Soroban docs: https://soroban.stellar.org/
- Open issue on GitHub repository

---

Happy deploying! 🚀
