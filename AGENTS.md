# AGENTS.md

## Cursor Cloud specific instructions

Race Training Tracker is a single Next.js 16 (App Router, Turbopack) app. Data is
stored in Postgres accessed through `@vercel/postgres` (the Neon serverless
driver) + Drizzle ORM. There is only one service to run (the Next.js dev server),
plus the local database plumbing described below. Standard commands live in
`README.md` / `package.json` scripts (`npm run dev`, `npm run build`,
`npm run lint`, `npm run db:push`).

### The non-obvious part: `@vercel/postgres` does not speak raw Postgres

`@vercel/postgres` connects to a **Neon HTTPS/WSS endpoint**, not a normal
Postgres TCP port. The bundled driver hard-codes the endpoint from the host:
`https://<host>/sql` (HTTP queries, used by `scripts/seed.ts` and the
`ensureTables()` call in `app/api/setup/route.ts`) and `wss://<host>/v2`
(WebSocket pool, used by every Drizzle query) — both on **port 443**, ignoring
any port in the connection string. A host containing a dot is rewritten
(`db.x.me` → `api.x.me`), so the connection-string host must be exactly
`localhost`.

To run locally we bridge that to a normal local Postgres with a tiny
Neon-compatible proxy committed at `scripts/dev-neon-proxy.mjs` (HTTP `/sql` via
`pg`, WS `/v2` raw-tunneled to TCP). Because the driver fixes port 443, the proxy
binds 443 (needs `sudo`) and uses a self-signed cert trusted via
`NODE_EXTRA_CA_CERTS`.

`POSTGRES_URL=postgresql://raceuser:racepass@localhost/main` works for **both**
the app (→ proxy:443 → pg:5432) and `drizzle-kit db:push` (direct pg:5432).

Gotchas:
- Loopback Postgres auth must be cleartext `password`, **not** `scram-sha-256`:
  the Neon WS driver pipelines the password and fails SCRAM negotiation.
  `scripts/dev-up.sh` flips `pg_hba.conf` accordingly.
- `NODE_EXTRA_CA_CERTS` must be set in the launching shell (it is read at process
  startup); putting it in `.env.local` is too late and TLS will fail.
- `.env.local` is gitignored; `scripts/dev-up.sh` recreates it.
- `next build` and `next dev` share `.next`; after running `npm run build`,
  `rm -rf .next` and restart the dev server.
- `npm run lint` reports a few pre-existing errors/warnings in the app code —
  that is the repo's current state, not a setup problem.

### Running the app

```bash
./scripts/dev-up.sh                       # idempotent: postgres + role/db + cert + .env.local
sudo node scripts/dev-neon-proxy.mjs      # terminal 1: Neon proxy on https://localhost:443
NODE_EXTRA_CA_CERTS=scripts/dev-certs/localhost.pem npm run dev   # terminal 2: app on :3000
```

Postgres is **not** auto-started on a fresh VM: run
`sudo pg_ctlcluster 16 main start` (or just `./scripts/dev-up.sh`, which does it).
Tables are created automatically the first time the `/setup` flow is submitted
(or run `POSTGRES_URL=... npm run db:push`).
