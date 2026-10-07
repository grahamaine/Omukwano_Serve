# Wallets and payments

## Wallet connection (Solana)

`frontend/src/wallets.ts` registers **Phantom**, **Solflare** and **WalletConnect**.

- Phantom / Solflare work with the browser extension, or inside the wallet app's own browser on a phone.
- **WalletConnect** shows a QR code (or opens the wallet app on mobile). It needs a free project ID:
  1. Create a project at <https://cloud.reown.com> and copy the **Project ID**.
  2. Add it as `VITE_WALLETCONNECT_PROJECT_ID` (local `frontend/.env.local`, and in Vercel project settings).
  3. Add your site URL (`https://omukwano-solana.vercel.app`) to the project's allowed domains.
- Without the ID, WalletConnect is hidden and a console warning appears.

## Mobile money and card payments

Serverless functions in `frontend/api/pay/` talk to each provider. **Credentials only ever live in
server environment variables** (no `VITE_` prefix, never committed). See `frontend/.env.example`.

| Provider | Endpoint | Provider docs |
|---|---|---|
| MTN MoMo Uganda | `POST /api/pay/mtn`, `GET /api/pay/mtn?ref=` | <https://momodeveloper.mtn.com> |
| Airtel Money Uganda | `POST /api/pay/airtel`, `GET /api/pay/airtel?id=` | <https://developers.airtel.africa> |
| Pesapal (card, bank, mobile money) | `POST /api/pay/pesapal`, `GET /api/pay/pesapal?tracking=` | <https://developer.pesapal.com> |

### Getting credentials (you must do these; they need your business details)

- **MTN:** sign up at the MoMo developer portal, subscribe to **Collections**, create an API user and
  key in the sandbox, set `MTN_*`. Sandbox only accepts currency `EUR`; production uses `UGX` and
  `MTN_TARGET_ENV=mtnuganda` after MTN approves your business.
- **Airtel:** register at the Airtel developer portal for UAT credentials (`AIRTEL_CLIENT_ID/SECRET`).
  Production access needs Airtel business onboarding. Check that `AIRTEL_PAYMENT_PATH` matches the
  version shown in your Airtel dashboard.
- **Pesapal:** get a consumer key/secret from the demo environment, set `PESAPAL_*` and
  `PUBLIC_APP_URL`, then register the notification URL once:
  `POST /api/pay/pesapal?action=register-ipn` and store the returned `ipn_id` as `PESAPAL_IPN_ID`.

### Status

These endpoints are written from the providers' public documentation and **have not been run against
live sandbox credentials**. Expect to adjust field names after the first real test.

## Important limits of the current design

- The widget uses a demo job reference and an amount typed by the user. In production the amount and
  job must come from the on-chain `Job`, never from the browser.
- Collecting UGX through mobile money does not by itself move USDC into the escrow vault. A server
  step (treasury wallet funding `fund_job` after a confirmed payment) is still to be built, along with
  webhook verification and idempotency so a payment is credited only once.
- Add rate limiting before going live, and keep payment secrets out of logs.
