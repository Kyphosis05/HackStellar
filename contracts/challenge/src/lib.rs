#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, token, Address, Env, String, Vec};

#[contracttype]
#[derive(Clone)]
pub struct Challenge {
    pub id: u32,
    pub creator: Address,
    pub title: String,
    pub description: String,
    pub prize_pool: i128,
    pub end_date: u64,
    pub participants: Vec<Address>,
    pub winner: Option<Address>,
    pub is_active: bool,
}

#[contracttype]
pub enum DataKey {
    Challenge(u32),
    ChallengeCount,
}

#[contract]
pub struct ChallengeContract;

#[contractimpl]
impl ChallengeContract {
    /// Initialize the contract
    pub fn initialize(env: Env) {
        env.storage().instance().set(&DataKey::ChallengeCount, &0u32);
    }

    /// Create a new challenge
    pub fn create_challenge(
        env: Env,
        creator: Address,
        title: String,
        description: String,
        prize_pool: i128,
        end_date: u64,
        token_address: Address,
    ) -> u32 {
        creator.require_auth();

        // Lock prize pool tokens in contract
        let token_client = token::Client::new(&env, &token_address);
        token_client.transfer(&creator, &env.current_contract_address(), &prize_pool);

        // Get current challenge count
        let mut count: u32 = env
            .storage()
            .instance()
            .get(&DataKey::ChallengeCount)
            .unwrap_or(0);

        count += 1;

        // Create challenge
        let challenge = Challenge {
            id: count,
            creator: creator.clone(),
            title,
            description,
            prize_pool,
            end_date,
            participants: Vec::new(&env),
            winner: None,
            is_active: true,
        };

        // Store challenge
        env.storage()
            .instance()
            .set(&DataKey::Challenge(count), &challenge);
        env.storage().instance().set(&DataKey::ChallengeCount, &count);

        count
    }

    /// Join a challenge
    pub fn join_challenge(env: Env, challenge_id: u32, participant: Address) {
        participant.require_auth();

        let mut challenge: Challenge = env
            .storage()
            .instance()
            .get(&DataKey::Challenge(challenge_id))
            .expect("Challenge not found");

        // Check if challenge is still active
        if !challenge.is_active {
            panic!("Challenge is not active");
        }

        if env.ledger().timestamp() > challenge.end_date {
            panic!("Challenge has ended");
        }

        // Add participant
        challenge.participants.push_back(participant);

        // Save updated challenge
        env.storage()
            .instance()
            .set(&DataKey::Challenge(challenge_id), &challenge);
    }

    /// Set challenge winner and distribute prize
    pub fn set_winner(
        env: Env,
        challenge_id: u32,
        winner: Address,
        token_address: Address,
    ) {
        let mut challenge: Challenge = env
            .storage()
            .instance()
            .get(&DataKey::Challenge(challenge_id))
            .expect("Challenge not found");

        // Only creator can set winner
        challenge.creator.require_auth();

        // Check if challenge has ended
        if env.ledger().timestamp() <= challenge.end_date {
            panic!("Challenge has not ended yet");
        }

        // Transfer prize to winner
        let token_client = token::Client::new(&env, &token_address);
        token_client.transfer(
            &env.current_contract_address(),
            &winner,
            &challenge.prize_pool,
        );

        // Update challenge
        challenge.winner = Some(winner);
        challenge.is_active = false;

        env.storage()
            .instance()
            .set(&DataKey::Challenge(challenge_id), &challenge);
    }

    /// Get challenge details
    pub fn get_challenge(env: Env, challenge_id: u32) -> Challenge {
        env.storage()
            .instance()
            .get(&DataKey::Challenge(challenge_id))
            .expect("Challenge not found")
    }

    /// Get total challenge count
    pub fn get_challenge_count(env: Env) -> u32 {
        env.storage()
            .instance()
            .get(&DataKey::ChallengeCount)
            .unwrap_or(0)
    }
}
