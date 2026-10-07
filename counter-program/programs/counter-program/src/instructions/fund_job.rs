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
    require!(ctx.accounts.job.status == JobStatus::Created, ErrorCode::WrongStatus);

    let cpi_ctx = CpiContext::new(
        ctx.accounts.token_program.key(),
        TransferChecked {
            from: ctx.accounts.customer_token_account.to_account_info(),
            mint: ctx.accounts.mint.to_account_info(),
            to: ctx.accounts.vault.to_account_info(),
            authority: ctx.accounts.customer.to_account_info(),
        },
    );
    transfer_checked(cpi_ctx, ctx.accounts.job.amount, ctx.accounts.mint.decimals)?;

    ctx.accounts.job.status = JobStatus::Funded;
    Ok(())
}
