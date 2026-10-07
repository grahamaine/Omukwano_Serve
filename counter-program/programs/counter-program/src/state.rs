use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Counter {
    pub authority: Pubkey,
    pub count: u64,
    pub bump: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq, InitSpace)]
pub enum JobStatus {
    Created,   // job exists, nothing deposited yet
    Funded,    // customer's payment is locked in the vault
    Released,  // provider has been paid
    Cancelled, // cancelled before funding
    Refunded,  // customer got the money back
}

/// One service booking: a customer pays a provider once the work is confirmed.
#[account]
#[derive(InitSpace)]
pub struct Job {
    pub customer: Pubkey,
    pub provider: Pubkey,
    pub mint: Pubkey,        // the stablecoin (e.g. USDC)
    pub amount: u64,         // in the mint's smallest unit
    pub code_hash: [u8; 32], // hash of the secret confirmation code
    pub deadline: i64,       // unix time after which the customer can reclaim funds
    pub job_id: u64,         // lets one customer have many jobs
    pub status: JobStatus,
    pub bump: u8,
}
