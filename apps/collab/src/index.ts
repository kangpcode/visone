import { createServer } from "node:http";

const PORT = Number(process.env.COLLAB_PORT ?? 1234);

/**
 * Phase 0 scaffold for the VISONE Realtime Collaboration Server.
 * Phase 3 mounts the Hocuspocus / Yjs WebSocket handler onto this server.
 */
const server = createServer((req, res) => {
  if (req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ service: "visone-collab", status: "ready", phase: "phase-0" }));
    return;
  }

  res.writeHead(404);
  res.end("Not Found");
});

server.listen(PORT, () => {
  console.log(`[visone-collab] scaffold listening on port ${PORT}`);
});
