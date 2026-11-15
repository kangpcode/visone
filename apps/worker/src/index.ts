export const WORKER_QUEUES = {
  THUMBNAIL: "visone:thumbnail",
  EXPORT: "visone:export",
  DEPLOY: "visone:deploy",
  DOMAIN_SSL: "visone:domain-ssl",
} as const;

/**
 * Phase 0 scaffold for the VISONE background worker.
 * Phase 2/6 connects BullMQ queues backed by Redis for build, export, and deploy jobs.
 */
export function startWorkerScaffold() {
  const redisUrl = process.env.REDIS_URL ?? "redis://localhost:6379";
  console.log(`[visone-worker] scaffold initialized (target Redis: ${redisUrl})`);
  console.log(`[visone-worker] registered queues: ${Object.values(WORKER_QUEUES).join(", ")}`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  startWorkerScaffold();
}
