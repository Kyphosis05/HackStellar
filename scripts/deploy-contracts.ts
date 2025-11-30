import * as StellarSDK from "@stellar/stellar-sdk"
import fs from "fs"
import path from "path"

// Configuration
const NETWORK = "TESTNET" // Change to "PUBLIC" for mainnet
const NETWORK_PASSPHRASE = StellarSDK.Networks.TESTNET
const HORIZON_URL = "https://horizon-testnet.stellar.org"

// Initialize server
const server = new StellarSDK.Horizon.Server(HORIZON_URL)

// Load source account keypair from environment
const sourceSecret = process.env.STELLAR_SECRET_KEY
if (!sourceSecret) {
  throw new Error("STELLAR_SECRET_KEY environment variable is required")
}
const sourceKeypair = StellarSDK.Keypair.fromSecret(sourceSecret)

console.log(`Deploying contracts from account: ${sourceKeypair.publicKey()}`)

// Upload and deploy a contract
async function deployContract(contractName: string, wasmPath: string): Promise<string> {
  console.log(`\n📦 Deploying ${contractName}...`)

  // Step 1: Upload WASM
  console.log("1️⃣ Uploading WASM bytecode...")
  const wasmBuffer = fs.readFileSync(wasmPath)
  const uploadResponse = await uploadWasm(wasmBuffer)
  const wasmHash = uploadResponse.returnValue!.bytes()
  console.log(`✅ WASM uploaded. Hash: ${wasmHash.toString("hex")}`)

  // Step 2: Deploy contract
  console.log("2️⃣ Deploying contract...")
  const deployResponse = await createContract(wasmHash, uploadResponse.hash)
  const contractId = StellarSDK.StrKey.encodeContract(deployResponse.returnValue!.address().toBuffer())
  console.log(`✅ Contract deployed. ID: ${contractId}`)

  // Step 3: Initialize contract
  console.log("3️⃣ Initializing contract...")
  await initializeContract(contractId)
  console.log(`✅ Contract initialized`)

  return contractId
}

// Upload WASM bytecode
async function uploadWasm(wasmBuffer: Buffer): Promise<StellarSDK.SorobanRpc.Api.GetTransactionResponse> {
  const account = await server.getAccount(sourceKeypair.publicKey())

  const transaction = new StellarSDK.TransactionBuilder(account, {
    fee: StellarSDK.BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(
      StellarSDK.Operation.uploadContractWasm({
        wasm: wasmBuffer,
      }),
    )
    .setTimeout(30)
    .build()

  return await submitTransaction(transaction)
}

// Create contract instance
async function createContract(
  wasmHash: Buffer,
  salt: Buffer,
): Promise<StellarSDK.SorobanRpc.Api.GetTransactionResponse> {
  const account = await server.getAccount(sourceKeypair.publicKey())

  const transaction = new StellarSDK.TransactionBuilder(account, {
    fee: StellarSDK.BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(
      StellarSDK.Operation.createCustomContract({
        wasmHash: wasmHash,
        address: new StellarSDK.Address(sourceKeypair.publicKey()),
        salt: salt,
      }),
    )
    .setTimeout(30)
    .build()

  return await submitTransaction(transaction)
}

// Initialize contract
async function initializeContract(contractId: string): Promise<void> {
  const account = await server.getAccount(sourceKeypair.publicKey())

  const contract = new StellarSDK.Contract(contractId)

  const transaction = new StellarSDK.TransactionBuilder(account, {
    fee: StellarSDK.BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(contract.call("initialize"))
    .setTimeout(30)
    .build()

  await submitTransaction(transaction)
}

// Submit and wait for transaction
async function submitTransaction(
  transaction: StellarSDK.Transaction,
): Promise<StellarSDK.SorobanRpc.Api.GetTransactionResponse> {
  // Prepare transaction
  const prepared = await server.prepareTransaction(transaction)
  prepared.sign(sourceKeypair)

  // Submit transaction
  const response = await server.sendTransaction(prepared)
  const hash = response.hash

  console.log(`   Transaction hash: ${hash}`)
  console.log(`   Waiting for confirmation...`)

  // Wait for transaction result
  let getResponse = await server.getTransaction(hash)
  while (getResponse.status === "NOT_FOUND") {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    getResponse = await server.getTransaction(hash)
  }

  if (getResponse.status === "SUCCESS") {
    console.log(`   ✅ Transaction confirmed`)
    return getResponse
  } else {
    console.error(`   ❌ Transaction failed:`, getResponse)
    throw new Error("Transaction failed")
  }
}

// Main deployment
async function main() {
  console.log("🚀 Starting Soroban contract deployment...\n")

  try {
    // Deploy Donation Contract
    const donationContractId = await deployContract(
      "Donation Contract",
      path.join(__dirname, "../contracts/donation/target/wasm32-unknown-unknown/release/donation_contract.wasm"),
    )

    // Deploy Challenge Contract
    const challengeContractId = await deployContract(
      "Challenge Contract",
      path.join(__dirname, "../contracts/challenge/target/wasm32-unknown-unknown/release/challenge_contract.wasm"),
    )

    // Save contract IDs to file
    const contractIds = {
      donation: donationContractId,
      challenge: challengeContractId,
      network: NETWORK,
      deployedAt: new Date().toISOString(),
    }

    fs.writeFileSync(path.join(__dirname, "../contract-ids.json"), JSON.stringify(contractIds, null, 2))

    console.log("\n✅ All contracts deployed successfully!")
    console.log("\n📝 Contract IDs:")
    console.log(`   Donation: ${donationContractId}`)
    console.log(`   Challenge: ${challengeContractId}`)
    console.log(`\n💾 Contract IDs saved to contract-ids.json`)
  } catch (error) {
    console.error("\n❌ Deployment failed:", error)
    process.exit(1)
  }
}

main()
