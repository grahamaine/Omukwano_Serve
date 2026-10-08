use anchor_lang::prelude::*;
use anchor_spl::token_interface::{transfer_checked, Mint, TokenAccount, TokenInterface, TransferChecked};

use crate::error::ErrorCode;
use crate::{Job, JobStatus, JOB_SEED};

#[derive(Accounts)]
pub struct Refund<'info> {
    pub customer: Signer<'info>,

    #[account(
        mut,
        has_one = customer,
        has_one = mint,
        seeds = [JOB_SEED.as_bytes(), job.customer.as_ref(), &job.job_id.to_le_bytes()],
        bump = job.bump
    )]
    pub job: Account<'info, Job>,

    pub mint: InterfaceAccount<'info, Mint>,

    #[account(
        mut,
        seeds = [b"vault", job.key().as_ref()],
        bump,
        token::mint = mint,
        token::authority = job
    )]
    pub vault: InterfaceAccount<'info, TokenAccount>,

    #[account(mut, token::mint = mint, token::authority = customer)]
    pub customer_token_account: InterfaceAccount<'info, TokenAccount>,

    pub token_program: Interface<'info, TokenInterface>,
}

pub fn handler(ctx: Context<Refund>) -> Result<()> {
    require!(ctx.accounts.job.status == JobStatus::Funded, ErrorCode::WrongStatus);
    // The customer can only reclaim the money once the deadline has passed.
    require!(Clock::get()?.unix_timestamp > ctx.accounts.job.deadline, ErrorCode::TooEarly);

    let customer = ctx.accounts.job.customer;
    let job_id = ctx.accounts.job.job_id.to_le_bytes();
    let bump = [ctx.accounts.job.bump];
    let amount = ctx.accounts.job.amount;
    let signer_seeds: &[&[&[u8]]] = &[&[JOB_SEED.as_bytes(), customer.as_ref(), &job_id, &bump]];

    let cpi_ctx = CpiContext::new_with_signer(
        ctx.accounts.token_program.key(),
        TransferChecked {
            from: ctx.accounts.vault.to_account_info(),
            mint: ctx.accounts.mint.to_account_info(),
            to: ctx.accounts.customer_token_account.to_account_info(),
            authority: ctx.accounts.job.to_account_info(),
        },
        signer_seeds,
    );
    transfer_checked(cpi_ctx, amount, ctx.accounts.mint.decimals)?;

    ctx.accounts.job.status = JobStatus::Refunded;
    Ok(())
}