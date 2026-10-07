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

    // TODO (you): uncomment once increment.rs is finished.
    // pub fn increment(ctx: Context<Increment>) -> Result<()> {
    //     increment::handler(ctx)
    // }
}
