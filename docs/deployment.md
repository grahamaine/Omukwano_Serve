# Deployment

## Frontend (Vercel)

The app is a Vite + React site in `frontend/`. `frontend/vercel.json` sets the build and a
single-page-app rewrite.

**Dashboard:** import the GitHub repo, set **Root Directory** to `frontend`, framework **Vite**.

**CLI:**
```powershell
cd frontend
vercel link --yes --project omukwano-solana
vercel deploy --prod
```

Optional environment variable: `VITE_RPC_URL` (a custom devnet RPC). See `frontend/.env.example`.

## Program (Solana devnet)

Run from WSL, where Solana and Anchor are installed:
```bash
cd counter-program
solana config set --url devnet
solana airdrop 2          # if the wallet needs devnet SOL
anchor build
anchor deploy
cp target/idl/counter_program.json target/types/counter_program.ts ../frontend/src/idl/
```
After deploying, redeploy the frontend so it ships the latest interface file.

Never commit keypairs. `.gitignore` already excludes `*-keypair.json`, `target/` and `.env*`.
