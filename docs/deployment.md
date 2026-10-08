# Deployment

## Frontend (Vercel)

The app is a Vite + React site in `frontend/`. `frontend/vercel.json` sets the build and a
single-page-app rewrite.

**Dashboard:** import the GitHub repo, set **Root Directory** to `frontend`, framework **Vite**.

**CLI:**
```powershell
cd frontend
vercel link --yes --project pamoja-solana
vercel deploy --prod
```

Optional environment variable: `VITE_RPC_URL` (a custom devnet RPC). See `frontend/.env.example`.

## Program (Solana devnet)

Run from WSL, where Solana and Anchor are installed:
```bash
cd counter-program
solana airdrop 2 --url devnet   # if the wallet needs devnet SOL (the public faucet is rate limited; try faucet.solana.com)
anchor build
anchor program deploy --provider.cluster devnet
cp target/idl/counter_program.json target/types/counter_program.ts ../frontend/src/idl/
```
After deploying, redeploy the frontend so it ships the latest interface file.

`Anchor.toml` is set to `localnet` so tests run on a free local validator:
```bash
anchor test --validator legacy
```
(Anchor 1.x defaults to Surfpool; `--validator legacy` uses the standard Solana test validator.)

A deploy needs about 1.3 SOL for rent plus fees. If it fails with "Blockhash expired", retry with
`solana program deploy target/deploy/counter_program.so --program-id target/deploy/counter_program-keypair.json --url devnet --with-compute-unit-price 1000 --max-sign-attempts 20`,
and list or close leftover buffers with `solana program show --buffers --url devnet`.

Never commit keypairs. `.gitignore` already excludes `*-keypair.json`, `target/` and `.env*`.
