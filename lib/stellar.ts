// Stellar wallet integration utilities
import StellarSdk from "@stellar/stellar-sdk"
import { makeDonationWithContract } from "./soroban"

export interface WalletInfo {
  publicKey: string
  balance: string
}

// Connect to Stellar testnet (change to mainnet for production)
const server = new StellarSdk.Horizon.Server("https://horizon-testnet.stellar.org")

export async function connectFreighter(): Promise<string | null> {
  try {
    // Check if Freighter is installed
    if (typeof window === "undefined" || !window.freighter) {
      throw new Error("Freighter wallet not installed")
    }

    // Request access to the user's Stellar account
    const publicKey = await window.freighter.getPublicKey()
    return publicKey
  } catch (error) {
    console.error("Error connecting to Freighter:", error)
    return null
  }
}

export async function getWalletBalance(publicKey: string): Promise<string> {
  try {
    const account = await server.loadAccount(publicKey)
    const xlmBalance = account.balances.find((balance: any) => balance.asset_type === "native")
    return xlmBalance ? xlmBalance.balance : "0"
  } catch (error) {
    console.error("Error fetching wallet balance:", error)
    return "0"
  }
}

export async function sendPayment(
  fromPublicKey: string,
  toPublicKey: string,
  amount: string,
  memo?: string,
): Promise<boolean> {
  try {
    if (memo?.startsWith("Donation:")) {
      console.log("[v0] Attempting donation via Soroban contract...")
      const message = memo.replace("Donation: ", "")
      const success = await makeDonationWithContract(fromPublicKey, toPublicKey, amount, message)
      if (success) {
        console.log("[v0] Donation successful via Soroban contract")
        return true
      }
      console.log("[v0] Soroban contract failed, falling back to direct payment")
    }

    if (!window.freighter) {
      throw new Error("Freighter wallet not installed")
    }

    const account = await server.loadAccount(fromPublicKey)

    const transactionBuilder = new StellarSdk.TransactionBuilder(account, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: StellarSdk.Networks.TESTNET,
    })
      .addOperation(
        StellarSdk.Operation.payment({
          destination: toPublicKey,
          asset: StellarSdk.Asset.native(),
          amount: amount,
        }),
      )
      .setTimeout(30)

    if (memo) {
      transactionBuilder.addMemo(StellarSdk.Memo.text(memo))
    }

    const builtTransaction = transactionBuilder.build()
    const xdr = builtTransaction.toXDR()

    // Sign with Freighter
    const signedXdr = await window.freighter.signTransaction(xdr, {
      networkPassphrase: StellarSdk.Networks.TESTNET,
    })

    const transactionToSubmit = StellarSdk.TransactionBuilder.fromXDR(signedXdr, StellarSdk.Networks.TESTNET)

    await server.submitTransaction(transactionToSubmit as any)
    return true
  } catch (error) {
    console.error("Error sending payment:", error)
    return false
  }
}

// Type declaration for Freighter
declare global {
  interface Window {
    freighter?: {
      getPublicKey: () => Promise<string>
      signTransaction: (xdr: string, opts: { networkPassphrase: string }) => Promise<string>
      isConnected: () => Promise<boolean>
    }
  }
}
