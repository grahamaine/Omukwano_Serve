# Omukwano escrow: build spec

A `Job` is one service booking. Money moves only through the program.

```
Created --fund_job--> Funded --release(code)--> Released
   |                     |
 cancel              refund (after deadline, customer only)
   v                     v
Cancelled             Refunded
```

## Already done
- `Job` account + `JobStatus` (`state.rs`)
- `create_job` (`instructions/create_job.rs`): validates amount and deadline, stores the job

## Yours to write (in this order)

### 1. `fund_job` (customer)
- Accounts: customer (Signer), job (mut, has_one = customer), mint, customer token account,
  vault token account (PDA, seeds `["vault", job]`, authority = job), token program, system program.
- Require status `Created`. Transfer `job.amount` from the customer's token account to the vault
  (token CPI: `anchor_spl::token::transfer`). Set status `Funded`.
- Needs the `anchor-spl` dependency in `programs/counter-program/Cargo.toml`.

### 2. `release` (provider)
- Instruction arg: `code: String` (or bytes).
- Require status `Funded`, signer == `job.provider`.
- Hash the code and compare with `job.code_hash`, else `ErrorCode::WrongCode`.
  Use the same hash on the client (frontend) when the customer creates the job.
- Transfer the vault balance to the provider's token account, signing as the job PDA
  (`CpiContext::new_with_signer`). Set status `Released`.

### 3. `cancel` (customer)
- Only while status is `Created`. Set `Cancelled`. (Nothing was deposited.)

### 4. `refund` (customer)
- Require status `Funded` and `Clock::unix_timestamp > job.deadline` (else `TooEarly`).
- Transfer the vault balance back to the customer. Set `Refunded`.

## Later
- Arbiter / dispute instruction.
- Mobile money and bank transfer on-ramp (off-chain, funds `fund_job` for the customer).
- Replace the demo data in `frontend/src/ui/Dashboard.tsx` with real `Job` accounts.

## Tests to write (`tests/`)
For each instruction: the happy path, plus the failure paths (wrong code, wrong signer,
refund before the deadline, double release).
