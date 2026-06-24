#!/usr/bin/env bash
# Idempotent local dev bootstrap for Cursor Cloud (and any Linux dev box).
#
# This app talks to Postgres through @vercel/postgres / @neondatabase/serverless,
# which expects a *Neon* endpoint (HTTPS /sql + secure WebSocket /v2), not a plain
# Postgres TCP port. To run locally with ZERO application code changes we:
#   1. run a local Postgres (cleartext "password" auth on 127.0.0.1, which is what
#      the neon driver's pipelineConnect="password" default expects),
#   2. run a tiny TLS proxy (scripts/neon-local-proxy.mjs) on :443 that emulates a
#      Neon endpoint and forwards to local Postgres,
#   3. trust the proxy's self-signed cert via NODE_EXTRA_CA_CERTS,
#   4. point POSTGRES_URL at postgres://marathon:marathon@localhost/marathon.
#
# Safe to re-run. Start the dev server separately (see AGENTS.md):
#   export NODE_EXTRA_CA_CERTS="$HOME/.cursor-neon-proxy/certs/cert.pem"
#   npm run dev
set -euo pipefail

TOOLS_DIR="${NEON_PROXY_TOOLS_DIR:-$HOME/.cursor-neon-proxy}"
CERT_DIR="$TOOLS_DIR/certs"
REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PG_DB="marathon"
PG_USER="marathon"
PG_PASS="marathon"

echo ">>> [1/5] Ensure Postgres is running"
if ! pg_lsclusters -h 2>/dev/null | grep -q online; then
  sudo pg_ctlcluster 16 main start || true
fi
# 127.0.0.1 must use cleartext 'password' auth to match the neon driver default.
HBA="/etc/postgresql/16/main/pg_hba.conf"
if ! sudo grep -qE '^host\s+all\s+all\s+127\.0\.0\.1/32\s+password' "$HBA"; then
  echo "    (configure pg_hba 127.0.0.1 -> password)"
  sudo sed -i -E 's|^(host\s+all\s+all\s+127\.0\.0\.1/32\s+).*$|\1password|' "$HBA"
  sudo sed -i -E 's|^(host\s+all\s+all\s+::1/128\s+).*$|\1password|' "$HBA"
  sudo pg_ctlcluster 16 main reload || true
fi

echo ">>> [2/5] Ensure database + role exist"
sudo -u postgres psql -v ON_ERROR_STOP=1 -tAc \
  "SELECT 1 FROM pg_roles WHERE rolname='$PG_USER'" | grep -q 1 || \
  sudo -u postgres psql -v ON_ERROR_STOP=1 -c \
    "CREATE ROLE $PG_USER WITH LOGIN PASSWORD '$PG_PASS';"
sudo -u postgres psql -v ON_ERROR_STOP=1 -tAc \
  "SELECT 1 FROM pg_database WHERE datname='$PG_DB'" | grep -q 1 || \
  sudo -u postgres psql -v ON_ERROR_STOP=1 -c \
    "CREATE DATABASE $PG_DB OWNER $PG_USER;"

echo ">>> [3/5] Ensure proxy tool deps (pg) + self-signed localhost cert"
mkdir -p "$CERT_DIR"
if [ ! -f "$TOOLS_DIR/node_modules/pg/package.json" ]; then
  ( cd "$TOOLS_DIR" \
    && [ -f package.json ] || echo '{"name":"cursor-neon-proxy","private":true,"type":"module","dependencies":{"pg":"^8.13.1"}}' > package.json \
    && npm install --no-audit --no-fund )
fi
if [ ! -f "$CERT_DIR/cert.pem" ]; then
  openssl req -x509 -newkey rsa:2048 -nodes \
    -keyout "$CERT_DIR/key.pem" -out "$CERT_DIR/cert.pem" -days 3650 \
    -subj "/CN=localhost" \
    -addext "subjectAltName=DNS:localhost,IP:127.0.0.1" \
    -addext "basicConstraints=critical,CA:TRUE"
fi

echo ">>> [4/5] Ensure .env.local"
if [ ! -f "$REPO_DIR/.env.local" ]; then
  cat > "$REPO_DIR/.env.local" <<EOF
POSTGRES_URL=postgres://$PG_USER:$PG_PASS@localhost/$PG_DB
POSTGRES_URL_NON_POOLING=postgres://$PG_USER:$PG_PASS@localhost/$PG_DB
EOF
fi

echo ">>> [5/5] (Re)start the Neon-compat TLS proxy on :443"
if ! sudo ss -ltnp 2>/dev/null | grep -q ':443 '; then
  NODE_BIN="$(command -v node)"
  sudo NEON_PROXY_APP_DIR="$REPO_DIR" \
       NEON_PROXY_TOOLS_DIR="$TOOLS_DIR" \
       NEON_PROXY_CERT_DIR="$CERT_DIR" \
       NEON_PROXY_PORT=443 \
       "$NODE_BIN" "$REPO_DIR/scripts/neon-local-proxy.mjs" \
       >/tmp/neon-local-proxy.log 2>&1 &
  sleep 2
fi

echo
echo "Local stack ready. Next:"
echo "  export NODE_EXTRA_CA_CERTS=\"$CERT_DIR/cert.pem\""
echo "  npm run db:seed   # create tables (first time)"
echo "  npm run dev       # start Next.js on http://localhost:3000"
