use anchor_lang::prelude::*;
use anchor_spl::token_interface::{transfer_checked, Mint, TokenAccount, TokenInterface, TransferChecked};
use crate::error::ErrorCode;
use crate::{Job, JobStatus, JOB_SEED};

#[derive(Accounts)]
pub struct FundJob<'info> {
    #[account(mut)]
    pub customer: Signer<'info>,

    #[account(
        mut,
        has_one = customer,
        has_one = mint,
        seeds = [JOB_SEED.as_bytes(), customer.key().as_ref(), &job.job_id.to_le_bytes()],
        bump = job.bump
    )]
    pub job: Account<'info, Job>,

    pub mint: InterfaceAccount<'info, Mint>,

    #[account(mut, token::mint = mint, token::authority = customer)]
    pub customer_token_account: InterfaceAccount<'info, TokenAccount>,

    #[account(
        init,
        payer = customer,
        seeds = [b"vault", job.key().as_ref()],
        bump,
        token::mint = mint,
        token::authority = job,
        token::token_program = token_program
    )]
    pub vault: InterfaceAccount<'info, TokenAccount>,

    pub token_program: Interface<'info, TokenInterface>,
    pub system_program: Program<'info, System>,
}
pub fn handler(ctx: Context<FundJob>) -> Result<()> {
    // 1. Check the status is Created, else ErrorCode::WrongStatus (use require!).
    // 2. Move job.amount from customer_token_account to vault with transfer_checked.
    //    You need: a CpiContext::new(token_program, TransferChecked { from, mint, to, authority }),
    //    the amount, and mint.decimals.
    // 3. Set job.status = JobStatus::Funded.
    Ok(())
}
