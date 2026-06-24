# AGENTS.md

Race Training Tracker — Next.js 16 (App Router) + Drizzle ORM, backed by
`@vercel/postgres` (the Neon serverless driver). Single app; no separate backend.

Standard commands live in `package.json` (`dev`, `build`, `start`, `lint`,
`db:seed`, `db:generate`, `db:push`) and `README.md`.

## Cursor Cloud specific instructions

This app connects via `@vercel/postgres` / `@neondatabase/serverless`, which does
**not** speak plain Postgres TCP. It expects a **Neon endpoint**:
- raw `` sql`...` `` tagged-template queries (e.g. `scripts/seed.ts` and the
  `ensureTables()` calls in `app/api/setup/route.ts`) go over **HTTPS `POST /sql`**;
- all Drizzle queries (`db.select/insert/...`) go over a **secure WebSocket `/v2`**.

To run locally with **zero application code changes**, we run local Postgres plus a
tiny TLS proxy that emulates a Neon endpoint and forwards to Postgres. The driver's
relevant defaults: `useSecureWebSocket=true` (so the proxy must be TLS),
`forceDisablePgSSL=true` (plain Postgres inside the tunnel), and
`pipelineConnect="password"` (so Postgres must use cleartext `password` auth on
`127.0.0.1`).

### Start the stack (run every session)

```bash
# 1) boot Postgres + Neon-compat proxy + .env.local (idempotent, safe to re-run)
bash scripts/cursor-cloud-dev-setup.sh

# 2) ALWAYS export this so Node trusts the proxy's self-signed cert.
#    It MUST be set in the shell BEFORE `next dev` / tsx / build start, because
#    Node reads NODE_EXTRA_CA_CERTS at startup (it is NOT picked up from .env.local).
export NODE_EXTRA_CA_CERTS="$HOME/.cursor-neon-proxy/certs/cert.pem"

# 3) first time only: create tables
npm run db:seed

# 4) run the app
npm run dev          # http://localhost:3000
```

Then lint / build with the same env exported:

```bash
export NODE_EXTRA_CA_CERTS="$HOME/.cursor-neon-proxy/certs/cert.pem"
npm run lint         # eslint (NOTE: the repo currently has pre-existing lint errors)
npm run build
```

### Key facts / gotchas

- **The TLS proxy must be running on port `:443`** (the driver derives
  `https://localhost/sql` and `wss://localhost/v2`, both default ports). It binds
  443, so it is started with `sudo`. Source: `scripts/neon-local-proxy.mjs`.
- **`NODE_EXTRA_CA_CERTS` is mandatory** for any Node process that touches the DB
  (dev server, `db:seed`, `db:push`, build, ad-hoc `tsx` scripts). Without it the
  driver hangs/fails the TLS handshake to the proxy.
- **DB connection:** `POSTGRES_URL=postgres://marathon:marathon@localhost/marathon`
  in `.env.local` (gitignored; recreated by the setup script if missing).
- The proxy's `pg` dependency is a **proxy-only tool**, installed under
  `~/.cursor-neon-proxy/` — intentionally **not** added to the app's `package.json`.
- Postgres data and the proxy cert/deps persist in the VM snapshot, so on a warm
  start `scripts/cursor-cloud-dev-setup.sh` mostly no-ops. On a cold box it
  recreates everything (cert, role/db, `.env.local`, proxy).
- **Reset app data:** `curl -X DELETE http://localhost:3000/api/setup`.
- The proxy logs to `/tmp/neon-local-proxy.log` when started via the setup script.

### Quick sanity check

```bash
curl -s -X POST http://localhost:3000/api/setup -H 'Content-Type: application/json' \
  -d '{"raceName":"Test","raceLocation":"X","raceDate":"2026-08-23","distance":"full"}'
# -> {"success":true,...,"workoutsCreated":56}
```
