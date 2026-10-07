use anchor_lang::prelude::*;

#[error_code]
pub enum ErrorCode {
    #[msg("Counter overflow")]
    Overflow,
    #[msg("Amount must be greater than zero")]
    InvalidAmount,
    #[msg("Deadline must be in the future")]
    DeadlineInPast,
    #[msg("Job is not in the right status for this action")]
    WrongStatus,
    #[msg("Reference must be 2-8 uppercase letters or digits")]
    InvalidReference,
    #[msg("Only the confirmation service can release funds")]
    NotAttestor,
    #[msg("Only the provider can do this")]
    NotProvider,
    #[msg("Only the customer can do this")]
    NotCustomer,
    #[msg("The deadline has not passed yet")]
    TooEarly,
}
