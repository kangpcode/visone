import { VISONE_BRAND, getMessages } from "@visone/shared";
import { Layers, Rocket, Share2, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const t = getMessages("id");

  const modules = [
    {
      title: "Design Editor",
      desc: "Infinite canvas 60fps, vector bezier, auto layout, komponen & design tokens.",
      icon: Layers,
    },
    {
      title: "Realtime Collaboration",
      desc: "Yjs CRDT sync, live cursor, pin komentar ber-thread, dan RBAC granular.",
      icon: Share2,
    },
    {
      title: "1-Click Deploy Engine",
      desc: "Publish frame menjadi website live ke {project}.visone.app + custom domain SSL.",
      icon: Rocket,
    },
    {
      title: "Enterprise RBAC & Audit",
      desc: "Platform & workspace role matrix, API key, webhook, dan audit trail lengkap.",
      icon: ShieldCheck,
    },
  ];

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex max-w-5xl flex-col gap-12 px-6 py-20">
        <header className="flex flex-col gap-5">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-cyan-400" />
            {t.status.phase0Ready}
          </div>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            <span className="bg-gradient-to-r from-[#6C5CE7] via-[#4F46E5] to-[#06B6D4] bg-clip-text text-transparent">
              {VISONE_BRAND.name}
            </span>
          </h1>

          <p className="max-w-2xl text-lg text-muted-foreground">
            {VISONE_BRAND.tagline} Platform desain UI/UX kolaboratif yang terhubung
            langsung dengan pipeline deployment web modern.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/api/v1/health"
              className="rounded-lg bg-gradient-to-r from-[#6C5CE7] to-[#4F46E5] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:opacity-90"
            >
              Cek API Health (/api/v1/health)
            </Link>
            <Link
              href="/api/v1/openapi"
              className="rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground transition hover:bg-muted"
            >
              OpenAPI Spec (/api/v1/openapi)
            </Link>
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-2">
          {modules.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="rounded-xl border border-border bg-card p-6 transition hover:border-primary/50"
              >
                <div className="mb-3 inline-flex rounded-lg bg-primary/10 p-2.5 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="text-base font-semibold">{item.title}</h2>
                <p className="mt-1.5 text-sm text-muted-foreground">{item.desc}</p>
              </div>
            );
          })}
        </section>
      </div>
    </main>
  );
}
