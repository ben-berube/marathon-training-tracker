// Local dev TLS proxy that emulates a Neon endpoint so that @vercel/postgres /
// @neondatabase/serverless can talk to a plain local Postgres with ZERO
// application code changes.
//
// The Neon serverless driver (in Node) uses TWO transports against the host in
// POSTGRES_URL:
//   1. HTTP  POST https://<host>/sql  -- used by the `sql\`...\`` tagged template
//      (e.g. scripts/seed.ts and the app's ensureTables()). JSON in / JSON out.
//   2. WSS   wss://<host>/v2          -- used by the connection Pool, i.e. all
//      Drizzle queries. A raw Postgres-wire tunnel inside the WebSocket.
//
// This proxy terminates TLS on 443 and serves both:
//   - POST /sql   -> executes via `pg` and returns Neon's JSON result shape
//   - upgrade /v2 -> pipes the WebSocket bytes to/from a Postgres TCP socket
//
// Driver defaults it relies on: useSecureWebSocket=true (so TLS), and
// forceDisablePgSSL=true (so plain Postgres inside the tunnel). The cert is
// self-signed for localhost and trusted by Node via NODE_EXTRA_CA_CERTS.
import { createServer } from "node:https";
import { readFileSync } from "node:fs";
import net from "node:net";
import { createRequire } from "node:module";

// `ws` ships with @vercel/postgres in the app; resolve it from there.
const appRequire = createRequire(
  (process.env.NEON_PROXY_APP_DIR || "/workspace") + "/package.json"
);
// `pg` is a proxy-only tool dependency (NOT an app dependency); resolve it from
// a separate tools dir so it never has to be added to the app's package.json.
const toolsRequire = createRequire(
  (process.env.NEON_PROXY_TOOLS_DIR ||
    process.env.HOME + "/.cursor-neon-proxy") + "/package.json"
);
const { WebSocketServer } = appRequire("ws");
const { Pool } = toolsRequire("pg");

const CERT_DIR = process.env.NEON_PROXY_CERT_DIR;
const PORT = Number(process.env.NEON_PROXY_PORT || 443);
const PG_HOST = process.env.NEON_PROXY_PG_HOST || "127.0.0.1";
const PG_PORT = Number(process.env.NEON_PROXY_PG_PORT || 5432);
const DEBUG = process.env.NEON_PROXY_DEBUG === "1";
const log = (...a) => DEBUG && console.log("[neon-local-proxy]", ...a);

// Return every column value as its raw text representation; the neon driver
// sends Neon-Raw-Text-Output:true and parses types itself using dataTypeID.
const rawTextTypes = { getTypeParser: () => (v) => v };

// Cache one pg Pool per connection string (rewritten to hit local Postgres).
const pools = new Map();
function poolFor(connectionString) {
  let pool = pools.get(connectionString);
  if (pool) return pool;
  let user = "marathon";
  let password = "marathon";
  let database = "marathon";
  try {
    const u = new URL(connectionString.replace(/^postgres(ql)?:/, "http:"));
    if (u.username) user = decodeURIComponent(u.username);
    if (u.password) password = decodeURIComponent(u.password);
    const db = u.pathname.replace(/^\//, "");
    if (db) database = decodeURIComponent(db);
  } catch {
    // fall back to defaults
  }
  pool = new Pool({ host: PG_HOST, port: PG_PORT, user, password, database, max: 10 });
  pools.set(connectionString, pool);
  return pool;
}

const server = createServer(
  {
    cert: readFileSync(`${CERT_DIR}/cert.pem`),
    key: readFileSync(`${CERT_DIR}/key.pem`),
  },
  (req, res) => {
    if (req.method !== "POST") {
      res.writeHead(404).end();
      return;
    }
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", async () => {
      const connectionString = req.headers["neon-connection-string"] || "";
      let body;
      try {
        body = JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
      } catch (e) {
        res.writeHead(400, { "content-type": "application/json" });
        res.end(JSON.stringify({ message: "invalid JSON body" }));
        return;
      }
      const pool = poolFor(connectionString);
      try {
        if (Array.isArray(body.queries)) {
          // Batch / transaction request.
          const client = await pool.connect();
          try {
            await client.query("BEGIN");
            const results = [];
            for (const q of body.queries) {
              results.push(
                await client.query({
                  text: q.query,
                  values: q.params || [],
                  rowMode: "array",
                  types: rawTextTypes,
                })
              );
            }
            await client.query("COMMIT");
            res.writeHead(200, { "content-type": "application/json" });
            res.end(JSON.stringify({ results: results.map(formatResult) }));
          } catch (e) {
            try { await client.query("ROLLBACK"); } catch {}
            throw e;
          } finally {
            client.release();
          }
        } else {
          const result = await pool.query({
            text: body.query,
            values: body.params || [],
            rowMode: "array",
            types: rawTextTypes,
          });
          res.writeHead(200, { "content-type": "application/json" });
          res.end(JSON.stringify(formatResult(result)));
        }
      } catch (e) {
        log("sql error", e.message);
        res.writeHead(400, { "content-type": "application/json" });
        res.end(
          JSON.stringify({
            message: e.message,
            severity: e.severity,
            code: e.code,
            detail: e.detail,
            hint: e.hint,
            position: e.position,
            where: e.where,
            schema: e.schema,
            table: e.table,
            column: e.column,
            dataType: e.dataType,
            constraint: e.constraint,
            file: e.file,
            line: e.line,
            routine: e.routine,
          })
        );
      }
    });
  }
);

function formatResult(result) {
  return {
    command: result.command,
    rowCount: result.rowCount,
    fields: (result.fields || []).map((f) => ({
      name: f.name,
      dataTypeID: f.dataTypeID,
      tableID: f.tableID,
      columnID: f.columnID,
      dataTypeSize: f.dataTypeSize,
      dataTypeModifier: f.dataTypeModifier,
      format: f.format,
    })),
    rows: result.rows || [],
  };
}

server.on("tlsClientError", (e) => log("tlsClientError", e.message));

const wss = new WebSocketServer({ server });
wss.on("error", (e) => log("wss error", e.message));

wss.on("connection", (ws, req) => {
  log("ws connection", req.url);
  let host = PG_HOST;
  let port = PG_PORT;
  try {
    const url = new URL(req.url, "https://localhost");
    const address = url.searchParams.get("address");
    if (address) {
      const [h, p] = address.split(":");
      if (h) host = h;
      if (p) port = Number(p);
    }
  } catch {
    // use defaults
  }

  const tcp = net.connect(port, host);
  let open = false;
  const pending = [];

  tcp.on("connect", () => {
    open = true;
    for (const chunk of pending) tcp.write(chunk);
    pending.length = 0;
  });
  tcp.on("data", (data) => {
    if (ws.readyState === ws.OPEN) ws.send(data);
  });
  tcp.on("close", () => ws.close());
  tcp.on("error", () => ws.close());

  ws.on("message", (data) => {
    const buf = Buffer.isBuffer(data) ? data : Buffer.from(data);
    if (open) tcp.write(buf);
    else pending.push(buf);
  });
  ws.on("close", () => tcp.end());
  ws.on("error", () => tcp.destroy());
});

server.listen(PORT, () => {
  console.log(
    `[neon-local-proxy] listening on https://localhost:${PORT} (POST /sql + wss /v2) -> ${PG_HOST}:${PG_PORT}`
  );
});
