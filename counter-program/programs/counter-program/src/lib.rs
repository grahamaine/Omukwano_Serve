pub mod constants;
pub mod error;
pub mod instructions;
pub mod state;

use anchor_lang::prelude::*;

pub use constants::*;
pub use instructions::*;
pub use state::*;

declare_id!("9dLzUWtKppSVHsBBAAea7nqhWUy2pzY3E19PrnGdP2Q4");

#[program]
pub mod counter_program {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        initialize::handler(ctx)
    }

    pub fn create_job(
        ctx: Context<CreateJob>,
        job_id: u64,
        provider: Pubkey,
        mint: Pubkey,
        amount: u64,
        reference: String,
        attestor: Pubkey,
        deadline: i64,
    ) -> Result<()> {
        create_job::handler(ctx, job_id, provider, mint, amount, reference, attestor, deadline)
    }

    // TODO (you): uncomment once increment.rs is finished.
    // pub fn increment(ctx: Context<Increment>) -> Result<()> {
    //     increment::handler(ctx)
    // }
}
