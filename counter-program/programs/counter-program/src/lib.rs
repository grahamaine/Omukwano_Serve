pub mod constants;
pub mod error;
pub mod instructions;
pub mod state;

use anchor_lang::prelude::*;

pub use constants::*;
pub use instructions::*;
pub use state::*;

declare_id!("5ir5g7y8x3ENmgntpfY1nLBDxnvAJYUXZxLzMfh4kx6N");

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
        code_hash: [u8; 32],
        deadline: i64,
    ) -> Result<()> {
        create_job::handler(ctx, job_id, provider, mint, amount, code_hash, deadline)
    }

    // TODO (you): uncomment once increment.rs is finished.
    // pub fn increment(ctx: Context<Increment>) -> Result<()> {
    //     increment::handler(ctx)
    // }
}
