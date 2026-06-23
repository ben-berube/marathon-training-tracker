// Local Neon-compatible proxy for @vercel/postgres development.
//
// @vercel/postgres uses the @neondatabase/serverless driver, which talks to a
// Neon endpoint over HTTPS (`/sql`) and secure WebSockets (`/v2`) instead of a
// raw Postgres TCP connection. This tiny proxy emulates that endpoint on
// https://localhost:443 and forwards everything to a normal local Postgres so
// the app runs unmodified against a local database.
//
//   neon HTTP  ->  https://localhost/sql   ->  this proxy  ->  pg query
//   neon WS    ->  wss://localhost/v2      ->  this proxy  ->  raw TCP pipe to pg
//
// TLS uses a self-signed cert (scripts/dev-certs/localhost.pem); trust it in the
// Next.js / seed process via NODE_EXTRA_CA_CERTS=scripts/dev-certs/localhost.pem.
//
// Requires root (binds privileged port 443, which the driver hard-codes for the
// default `localhost` endpoint). Run with: sudo node scripts/dev-neon-proxy.mjs

import https from "node:https";
import net from "node:net";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { WebSocketServer } from "ws";
import pg from "pg";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CERT_DIR = path.join(__dirname, "dev-certs");
const KEY = fs.readFileSync(path.join(CERT_DIR, "localhost-key.pem"));
const CERT = fs.readFileSync(path.join(CERT_DIR, "localhost.pem"));

const PG_HOST = process.env.PROXY_PG_HOST || "127.0.0.1";
const PG_PORT = parseInt(process.env.PROXY_PG_PORT || "5432", 10);
const LISTEN_PORT = parseInt(process.env.PROXY_PORT || "443", 10);

// Reuse a pg pool per connection string for the HTTP /sql path.
const pools = new Map();
function poolFor(connectionString) {
  let p = pools.get(connectionString);
  if (!p) {
    p = new pg.Pool({
      connectionString,
      host: PG_HOST,
      port: PG_PORT,
      ssl: false,
      max: 5,
      // Return every value as raw text; the neon driver re-parses by OID.
      types: { getTypeParser: () => (v) => v },
    });
    pools.set(connectionString, p);
  }
  return p;
}

async function runHttpQuery(connectionString, payload) {
  const pool = poolFor(connectionString);
  const client = await pool.connect();
  try {
    const exec = async (q) => {
      const res = await client.query({
        text: q.query,
        values: q.params || [],
        rowMode: "array",
      });
      return {
        command: res.command,
        rowCount: res.rowCount,
        rows: res.rows,
        fields: (res.fields || []).map((f) => ({
          name: f.name,
          dataTypeID: f.dataTypeID,
          tableID: f.tableID,
          columnID: f.columnID,
          dataTypeSize: f.dataTypeSize,
          dataTypeModifier: f.dataTypeModifier,
          format: f.format,
        })),
        rowAsArray: true,
      };
    };

    if (Array.isArray(payload.queries)) {
      const results = [];
      for (const q of payload.queries) results.push(await exec(q));
      return { results };
    }
    return await exec(payload);
  } finally {
    client.release();
  }
}

const server = https.createServer({ key: KEY, cert: CERT }, (req, res) => {
  if (req.method === "POST" && req.url && req.url.startsWith("/sql")) {
    const connectionString = req.headers["neon-connection-string"];
    let body = "";
    req.on("data", (c) => (body += c));
    req.on("end", async () => {
      try {
        const payload = JSON.parse(body || "{}");
        const result = await runHttpQuery(connectionString, payload);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(result));
      } catch (err) {
        const status = err && err.code ? 400 : 500;
        res.writeHead(status, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            message: err.message,
            code: err.code,
            detail: err.detail,
            hint: err.hint,
            severity: err.severity,
          })
        );
      }
    });
    return;
  }
  res.writeHead(404);
  res.end("not found");
});

// WebSocket /v2: tunnel raw Postgres wire protocol bytes to a TCP socket.
const wss = new WebSocketServer({ server, path: "/v2" });
wss.on("connection", (ws) => {
  const tcp = net.connect(PG_PORT, PG_HOST);
  tcp.on("data", (d) => ws.readyState === ws.OPEN && ws.send(d));
  tcp.on("close", () => ws.close());
  tcp.on("error", () => ws.close());
  ws.on("message", (m) => tcp.write(m));
  ws.on("close", () => tcp.end());
  ws.on("error", () => tcp.end());
});

server.listen(LISTEN_PORT, () => {
  console.log(
    `[dev-neon-proxy] https://localhost:${LISTEN_PORT} -> postgres ${PG_HOST}:${PG_PORT} (HTTP /sql + WS /v2)`
  );
});
