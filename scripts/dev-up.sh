#!/usr/bin/env bash
# Idempotent local dev bootstrap for the Race Training Tracker.
#
# Brings up the local Postgres + Neon-compatible proxy that @vercel/postgres
# needs, then prints how to start the proxy and the Next.js dev server.
#
# Safe to run repeatedly. Requires sudo (Postgres control + privileged port 443).
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CERT_DIR="$ROOT/scripts/dev-certs"
PG_USER="raceuser"
PG_PASS="racepass"
PG_DB="main"
PG_VERSION="$(ls /etc/postgresql 2>/dev/null | head -1 || echo 16)"

echo "==> Ensuring PostgreSQL ($PG_VERSION) is running"
if ! sudo -u postgres psql -tAc "SELECT 1" >/dev/null 2>&1; then
  sudo pg_ctlcluster "$PG_VERSION" main start || true
  sleep 2
fi

HBA="/etc/postgresql/$PG_VERSION/main/pg_hba.conf"
if [ -f "$HBA" ] && sudo grep -qE '^host[[:space:]]+all[[:space:]]+all[[:space:]]+127\.0\.0\.1/32[[:space:]]+scram-sha-256' "$HBA"; then
  echo "==> Switching loopback auth to cleartext password (required by neon WS driver)"
  # The @neondatabase/serverless WS driver (used via @vercel/postgres) pipelines
  # the password and does not negotiate SCRAM cleanly against local Postgres.
  sudo sed -i -E 's#^(host[[:space:]]+all[[:space:]]+all[[:space:]]+127\.0\.0\.1/32[[:space:]]+)scram-sha-256#\1password#; s#^(host[[:space:]]+all[[:space:]]+all[[:space:]]+::1/128[[:space:]]+)scram-sha-256#\1password#' "$HBA"
  sudo pg_ctlcluster "$PG_VERSION" main reload || true
fi

echo "==> Ensuring role '$PG_USER' and database '$PG_DB' exist"
sudo -u postgres psql -v ON_ERROR_STOP=1 >/dev/null <<SQL
DO \$\$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname='$PG_USER') THEN
    CREATE ROLE $PG_USER LOGIN PASSWORD '$PG_PASS';
  END IF;
END\$\$;
SQL
if ! sudo -u postgres psql -tAc "SELECT 1 FROM pg_database WHERE datname='$PG_DB'" | grep -q 1; then
  sudo -u postgres createdb -O "$PG_USER" "$PG_DB"
fi
sudo -u postgres psql -d "$PG_DB" -c "GRANT ALL ON SCHEMA public TO $PG_USER; ALTER SCHEMA public OWNER TO $PG_USER;" >/dev/null

echo "==> Ensuring self-signed dev cert for localhost"
if [ ! -f "$CERT_DIR/localhost.pem" ]; then
  mkdir -p "$CERT_DIR"
  openssl req -x509 -newkey rsa:2048 -nodes \
    -keyout "$CERT_DIR/localhost-key.pem" \
    -out "$CERT_DIR/localhost.pem" \
    -days 3650 -subj "/CN=localhost" \
    -addext "subjectAltName=DNS:localhost,IP:127.0.0.1" >/dev/null 2>&1
fi

echo "==> Ensuring .env.local"
ENV_FILE="$ROOT/.env.local"
if [ ! -f "$ENV_FILE" ]; then
  cat > "$ENV_FILE" <<ENV
# Local development environment (gitignored).
POSTGRES_URL=postgresql://$PG_USER:$PG_PASS@localhost/$PG_DB
POSTGRES_URL_NON_POOLING=postgresql://$PG_USER:$PG_PASS@localhost/$PG_DB
ENV
fi

cat <<INFO

Local dependencies are ready.

Start the Neon proxy (needs sudo for port 443), in its own terminal:
  sudo node scripts/dev-neon-proxy.mjs

Start the Next.js dev server (trust the dev cert via NODE_EXTRA_CA_CERTS):
  NODE_EXTRA_CA_CERTS=scripts/dev-certs/localhost.pem npm run dev

Then open http://localhost:3000
INFO
