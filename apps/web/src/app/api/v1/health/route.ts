import { prisma } from "@visone/db";
import { apiSuccess } from "@/lib/api-response";

export const dynamic = "force-dynamic";

export async function GET() {
  let databaseStatus: "connected" | "unavailable" = "unavailable";

  if (process.env.DATABASE_URL) {
    try {
      await prisma.$queryRaw`SELECT 1`;
      databaseStatus = "connected";
    } catch {
      databaseStatus = "unavailable";
    }
  }

  return apiSuccess({
    service: "visone-web",
    version: "0.1.0",
    phase: "phase-0",
    timestamp: new Date().toISOString(),
    checks: {
      api: "ok",
      database: databaseStatus,
    },
  });
}
