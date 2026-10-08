# Omukwano escrow: build spec

A `Job` is one booking for a service or goods order. Money moves only through the program.

```
Created --fund_job--> Funded --release (attestor signs)--> Released
   |                     |
 cancel              refund (after deadline, customer only)
   v                     v
Cancelled             Refunded
```

## Confirmation: reference + 6-digit code, checked off-chain

The customer receives an SMS/WhatsApp such as **`OMK-HAIR-483920`**:

- `HAIR` = public **reference** (service/goods type), stored on the `Job` and visible to all.
- `483920` = secret 6-digit code, known only to the customer and the confirmation service.

Why not hash the code on-chain? A 6-digit code has only 1,000,000 values, so a public hash can be
reversed instantly and a provider could release funds without the customer. Instead:

1. Provider enters the code in the app.
2. The confirmation service (the **attestor**) checks it against what it sent (max ~5 tries).
3. On a match the attestor signs the `release` transaction. The program only checks
   `attestor == job.attestor`.
4. Fallback: the customer can confirm directly with a wallet signature (no trust in the service).

Trade-off: trust in the attestor for code-based confirmation. State this openly in the pitch.

## References (fixed list, 2-8 uppercase letters/digits on-chain)

Services: `HAIR` beauty and barber, `REPR` repairs and fundis, `CLEN` cleaning, `BUIL` construction,
`REAL` real estate and property, `PROF` professional services (accounting, legal, IT, recruitment, BPO),
`DIGI` digital and software, `TELE` telecom and internet, `MOMO` mobile money and banking services,
`TOUR` tours and safaris, `STAY` hotels and lodges, `EVNT` events, `HLTH` health and wellness, `EDUC` tutoring and training.

Orders and deliveries: `FOOD` food and restaurants, `GROC` groceries and produce, `ELEC` electronics and fashion,
`SHOP` shops and retail, `RIDE` boda and cab rides, `DLVR` courier and freight, `UTIL` utilities and bills,
`PHAR` pharmacy and tele-health, `GOOD` other goods.

## Already done
- `Job` + `JobStatus` (`state.rs`): customer, provider, mint, amount, reference, attestor, deadline, status
- `create_job` (`instructions/create_job.rs`): validates amount, reference format and deadline

## Yours to write (in this order)

### 1. `fund_job` (customer)
- Accounts: customer (Signer), job (mut, has_one = customer), mint, customer token account,
  vault token account (PDA, seeds `["vault", job]`, authority = job), token program, system program.
- Require status `Created`. Transfer `job.amount` customer -> vault (`anchor_spl::token::transfer`).
  Set status `Funded`. Needs the `anchor-spl` dependency in `programs/counter-program/Cargo.toml`.

### 2. `release` (attestor)
- Require status `Funded` and signer == `job.attestor` (else `ErrorCode::NotAttestor`).
- Transfer the vault balance to the provider's token account, signing as the job PDA
  (`CpiContext::new_with_signer`). Set status `Released`.

### 3. `cancel` (customer)
- Only while status is `Created`. Set `Cancelled`.

### 4. `refund` (customer)
- Require status `Funded` and `Clock::unix_timestamp > job.deadline` (else `TooEarly`).
- Transfer the vault balance back to the customer. Set `Refunded`.

## Later
- Customer-signed confirmation (fallback), arbiter/dispute instruction.
- The attestor service (SMS sending, code check, rate limiting).
- Mobile money and bank transfer on-ramp that funds `fund_job` for the customer.
- Replace demo data in `frontend/src/ui/Dashboard.tsx` with real `Job` accounts.

## Tests (`tests/`)
Per instruction: happy path plus failures (wrong signer, bad reference, refund before deadline,
double release).
