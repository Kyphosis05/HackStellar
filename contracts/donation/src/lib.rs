#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, token, Address, Env, String, Vec};

#[contracttype]
#[derive(Clone)]
pub struct Donation {
    pub donor: Address,
    pub recipient: Address,
    pub amount: i128,
    pub message: String,
    pub timestamp: u64,
}

#[contracttype]
pub enum DataKey {
    Donations,
    DonationCount,
}

#[contract]
pub struct DonationContract;

#[contractimpl]
impl DonationContract {
    /// Initialize the contract
    pub fn initialize(env: Env) {
        env.storage().instance().set(&DataKey::DonationCount, &0u32);
    }

    /// Make a donation to a content creator
    pub fn donate(
        env: Env,
        donor: Address,
        recipient: Address,
        amount: i128,
        message: String,
        token_address: Address,
    ) -> u32 {
        donor.require_auth();

        // Transfer tokens from donor to recipient
        let token_client = token::Client::new(&env, &token_address);
        token_client.transfer(&donor, &recipient, &amount);

        // Create donation record
        let donation = Donation {
            donor: donor.clone(),
            recipient: recipient.clone(),
            amount,
            message,
            timestamp: env.ledger().timestamp(),
        };

        // Get current donation count
        let mut count: u32 = env
            .storage()
            .instance()
            .get(&DataKey::DonationCount)
            .unwrap_or(0);

        // Store donation
        env.storage()
            .instance()
            .set(&symbol_short!("DON"), &donation);

        // Increment count
        count += 1;
        env.storage().instance().set(&DataKey::DonationCount, &count);

        count
    }

    /// Get total donation count
    pub fn get_donation_count(env: Env) -> u32 {
        env.storage()
            .instance()
            .get(&DataKey::DonationCount)
            .unwrap_or(0)
    }

    /// Get donations for a specific recipient
    pub fn get_recipient_donations(env: Env, recipient: Address) -> Vec<Donation> {
        // In production, implement pagination
        Vec::new(&env)
    }
}
