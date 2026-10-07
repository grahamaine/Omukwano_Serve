<p align="center"><img src="brand/banner-1500x500.png" alt="Omukwano — Services & Suppliers, East Africa, built on Solana" width="100%"></p>

# Omukwano_Serve

Pay when the service is done. Customers lock a deposit, the provider does the job, and the money releases when the customer confirms with a short code — built on Solana for local service businesses (salons, repairs, suppliers) in Uganda.

> Status: early prototype for Encode Club Solana Hackathon 2026. The code is currently a counter starter that is being turned into the escrow program.

## Layout

- `counter-program/` — Anchor program (Rust). Build/deploy from WSL (solana + anchor live there).
- `frontend/` — Vite + React + wallet-adapter.

## Run

```bash
# Program (WSL)
cd counter-program && anchor build

# Frontend
cd frontend && npm install && npm run dev
```

## Roadmap

1. Escrow `Job` account with deposit, code-hash confirmation, cancel and timeout.
2. Frontend job flow for customer and provider.
3. Mobile money and bank transfer on-ramp via a payment partner.
