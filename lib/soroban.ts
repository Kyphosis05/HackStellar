import StellarSdk from "@stellar/stellar-sdk"

// Contract IDs (these will be set after deployment)
const DONATION_CONTRACT_ID = process.env.NEXT_PUBLIC_DONATION_CONTRACT_ID || ""
const CHALLENGE_CONTRACT_ID = process.env.NEXT_PUBLIC_CHALLENGE_CONTRACT_ID || ""

const server = new StellarSdk.Horizon.Server("https://horizon-testnet.stellar.org")
const NETWORK_PASSPHRASE = StellarSdk.Networks.TESTNET

// Native XLM asset
const XLM_ASSET = StellarSdk.Asset.native()

/**
 * Make a donation using the Soroban smart contract
 */
export async function makeDonationWithContract(
  donorPublicKey: string,
  recipientPublicKey: string,
  amount: string,
  message: string,
): Promise<boolean> {
  if (!DONATION_CONTRACT_ID) {
    console.warn("Donation contract not deployed, falling back to direct payment")
    return false
  }

  try {
    if (typeof window === "undefined" || !(window as any).freighterApi) {
      console.warn("Freighter wallet not available")
      return false
    }

    const account = await server.loadAccount(donorPublicKey)
    const contract = new StellarSdk.Contract(DONATION_CONTRACT_ID)

    // Convert amount to stroops (1 XLM = 10,000,000 stroops)
    const amountInStroops = BigInt(Number.parseFloat(amount) * 10_000_000)

    // Build transaction
    const transaction = new StellarSdk.TransactionBuilder(account, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: NETWORK_PASSPHRASE,
    })
      .addOperation(
        contract.call(
          "donate",
          StellarSdk.nativeToScVal(donorPublicKey, { type: "address" }),
          StellarSdk.nativeToScVal(recipientPublicKey, { type: "address" }),
          StellarSdk.nativeToScVal(amountInStroops, { type: "i128" }),
          StellarSdk.nativeToScVal(message, { type: "string" }),
        ),
      )
      .setTimeout(30)
      .build()

    // Sign and submit transaction
    const xdr = transaction.toXDR()
    const signedXdr = await (window as any).freighterApi.signTransaction(xdr, {
      networkPassphrase: NETWORK_PASSPHRASE,
    })

    const signedTx = StellarSdk.TransactionBuilder.fromXDR(signedXdr, NETWORK_PASSPHRASE)
    await server.submitTransaction(signedTx as any)
    return true
  } catch (error) {
    console.error("Error making donation with contract:", error)
    return false
  }
}

/**
 * Create a challenge using the Soroban smart contract
 */
export async function createChallengeWithContract(
  creatorPublicKey: string,
  title: string,
  description: string,
  prizePool: string,
  endDate: Date,
): Promise<number | null> {
  if (!CHALLENGE_CONTRACT_ID) {
    console.warn("Challenge contract not deployed")
    return null
  }

  try {
    if (typeof window === "undefined" || !(window as any).freighterApi) {
      console.warn("Freighter wallet not available")
      return null
    }

    const account = await server.loadAccount(creatorPublicKey)
    const contract = new StellarSdk.Contract(CHALLENGE_CONTRACT_ID)

    const prizeInStroops = BigInt(Number.parseFloat(prizePool) * 10_000_000)
    const endTimestamp = BigInt(Math.floor(endDate.getTime() / 1000))

    const transaction = new StellarSdk.TransactionBuilder(account, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: NETWORK_PASSPHRASE,
    })
      .addOperation(
        contract.call(
          "create_challenge",
          StellarSdk.nativeToScVal(creatorPublicKey, { type: "address" }),
          StellarSdk.nativeToScVal(title, { type: "string" }),
          StellarSdk.nativeToScVal(description, { type: "string" }),
          StellarSdk.nativeToScVal(prizeInStroops, { type: "i128" }),
          StellarSdk.nativeToScVal(endTimestamp, { type: "u64" }),
        ),
      )
      .setTimeout(30)
      .build()

    const xdr = transaction.toXDR()
    const signedXdr = await (window as any).freighterApi.signTransaction(xdr, {
      networkPassphrase: NETWORK_PASSPHRASE,
    })

    const signedTx = StellarSdk.TransactionBuilder.fromXDR(signedXdr, NETWORK_PASSPHRASE)
    await server.submitTransaction(signedTx as any)

    // Return a mock challenge ID (in production, parse from contract response)
    return 1
  } catch (error) {
    console.error("Error creating challenge with contract:", error)
    return null
  }
}

/**
 * Join a challenge using the Soroban smart contract
 */
export async function joinChallengeWithContract(participantPublicKey: string, challengeId: number): Promise<boolean> {
  if (!CHALLENGE_CONTRACT_ID) {
    console.warn("Challenge contract not deployed")
    return false
  }

  try {
    if (typeof window === "undefined" || !(window as any).freighterApi) {
      console.warn("Freighter wallet not available")
      return false
    }

    const account = await server.loadAccount(participantPublicKey)
    const contract = new StellarSdk.Contract(CHALLENGE_CONTRACT_ID)

    const transaction = new StellarSdk.TransactionBuilder(account, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: NETWORK_PASSPHRASE,
    })
      .addOperation(
        contract.call(
          "join_challenge",
          StellarSdk.nativeToScVal(challengeId, { type: "u32" }),
          StellarSdk.nativeToScVal(participantPublicKey, { type: "address" }),
        ),
      )
      .setTimeout(30)
      .build()

    const xdr = transaction.toXDR()
    const signedXdr = await (window as any).freighterApi.signTransaction(xdr, {
      networkPassphrase: NETWORK_PASSPHRASE,
    })

    const signedTx = StellarSdk.TransactionBuilder.fromXDR(signedXdr, NETWORK_PASSPHRASE)
    await server.submitTransaction(signedTx as any)
    return true
  } catch (error) {
    console.error("Error joining challenge with contract:", error)
    return false
  }
}

export { DONATION_CONTRACT_ID, CHALLENGE_CONTRACT_ID }
