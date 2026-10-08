<p align="center"><img src="brand/banner-1500x500.png" alt="Omukwano — Services & Suppliers, East Africa, built on Solana" width="100%"></p>

# Omukwano

**Pay when the service is done.** Omukwano is a Solana escrow app for local businesses in East Africa: salons, repairs, rides, food, shops and suppliers. A customer locks a payment, the provider does the job, and the money is released when the customer confirms with a short code.

**Live demo:** https://omukwano-solana.vercel.app (Solana devnet)

> Status: early prototype for the Encode Club Solana Hackathon 2026. The interface, payment API routes and the first on-chain instruction (`create_job`) exist. The escrow instructions that move money (`fund_job`, `release`, `cancel`, `refund`) are still being written, and the dashboard shows demo data.

## How it works

1. **Lock.** The customer's payment goes into a vault owned by the Solana program.
2. **Serve.** The provider does the job or delivers the order.
3. **Confirm.** The customer gets an SMS like `OMK-HAIR-483920` (a service reference plus a 6-digit code). A confirmation service checks it and signs the release.
4. **Safety nets.** The customer can cancel before funding, or reclaim the money after the deadline.

More detail: [docs/how-it-works.md](docs/how-it-works.md).

## What is in the app

- Services and store categories (beauty, repairs, cleaning, construction, rides, food, delivery, shops and more), each with a job reference code.
- Business dashboard preview (escrow balance, payouts, provider levels, embeddable "Pay with Omukwano" button).
- Wallet connection: Phantom, Solflare and WalletConnect.
- Payment routes for MTN MoMo, Airtel Money and Pesapal (card, bank, mobile money), plus a crypto option.
- Supported-chains logo slideshow, mobile-first layout, Oswald typography.

## Tech

| Part | Stack |
|---|---|
| On-chain program | Rust, Anchor 1.x, Solana devnet |
| Frontend | React, TypeScript, Vite, Solana wallet-adapter, Lucide icons |
| Serverless API | Vercel functions in `frontend/api/` |
| Hosting | Vercel |

## Repository layout

```
counter-program/   Anchor program (Job account, create_job, starter counter)
frontend/          Vite + React app and the /api payment routes
brand/             Logo, thumbnail and banner
docs/              Specs and guides
```

## Run it locally

```bash
# Frontend
cd frontend
npm install
cp .env.example .env.local      # fill in what you need (see docs/payments.md)
npm run dev
```

```bash
# Program (use WSL on Windows; Solana and Anchor are installed there)
cd counter-program
anchor build
```

Environment variables are listed in [`frontend/.env.example`](frontend/.env.example). Never commit real keys: payment credentials belong in server-side environment variables only.

## Docs

- [How it works](docs/how-it-works.md)
- [Escrow build spec](docs/escrow-design.md)
- [Deployment](docs/deployment.md)
- [Wallets and payments (WalletConnect, MTN, Airtel, Pesapal)](docs/payments.md)
- [Confirmation service (SMS code to release)](docs/confirmation-service.md)

## Roadmap

1. ✅ Escrow program: `create_job`, `fund_job`, `release`, `cancel`, `refund`, with tests (live on devnet).
2. ✅ Dashboard and crypto checkout connected to real on-chain jobs.
3. ✅ Confirmation service built and tested (SMS code, wallet-signed request, attempt limits). Needs Upstash and Africa's Talking accounts to switch on.
4. Server step that funds the escrow after a confirmed mobile money or card payment.
5. Sandbox testing of MTN, Airtel and Pesapal, then production onboarding.

## Honest limits

- Confirmation by SMS code relies on a trusted confirmation service, because a 6-digit code cannot be safely verified on-chain. A wallet-signed confirmation is planned as a fallback.
- The payment routes were written from the providers' public documentation and have not yet been run against live sandbox credentials.
