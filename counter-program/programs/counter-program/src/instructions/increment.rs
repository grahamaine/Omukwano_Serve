use anchor_lang::prelude::*;

use crate::{Counter, SEED};

// TODO (you): write this instruction.
//   1. Add the accounts: the authority (Signer) and the counter PDA
//      (same seeds as in initialize.rs, plus `bump = counter.bump`).
//   2. Make sure only the stored authority can increment
//      (hint: `has_one = authority`).
//   3. In `handler`, add 1 to `counter.count` using checked_add and
//      return an error from error.rs on overflow.
//   4. Register it in instructions.rs and lib.rs.
#[derive(Accounts)]
pub struct Increment<'info> {
    pub authority: Signer<'info>,
    #[account(mut, seeds = [SEED.as_bytes(), authority.key().as_ref()], bump = counter.bump)]
    pub counter: Account<'info, Counter>,
}

pub fn handler(_ctx: Context<Increment>) -> Result<()> {
    todo!("increment the counter")
}
