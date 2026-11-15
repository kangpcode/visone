# VISONE — Arsitektur Sistem (Fase 0)

> **Tagline:** *"Design. Share. Deploy. — All in one."*

## 1. Keputusan Arsitektur & Alasan

| Komponen | Pilihan Teknologi | Alasan Utama |
|---|---|---|
| **Monorepo** | `pnpm` workspaces | Berbagi skema Prisma (`@visone/db`), guard RBAC (`@visone/rbac`), dan validasi Zod (`@visone/shared`) secara konsisten antar service. |
| **Frontend & API** | Next.js 15 (App Router) + TypeScript + Tailwind CSS + shadcn/ui | SSR/RSC untuk dashboard & marketplace yang SEO-friendly, sekaligus `/api/v1/*` Route Handlers yang stateless. |
| **Canvas Engine** | HTML5 Canvas / Konva + Zustand | Kontrol penuh atas spatial culling, hit-testing, dan rendering 60fps untuk 5.000+ layer, dengan state reaktif yang terpisah dari render loop. |
| **Realtime Collab** | Yjs (CRDT) + Hocuspocus (`apps/collab`) | Resolusi konflik otomatis (CRDT) untuk multi-user canvas editing, presence, dan live cursor tanpa lock. |
| **Database & Cache** | PostgreSQL + Prisma ORM + Redis | Integritas relasional untuk RBAC/billing/deployment, dipadu Redis untuk rate limiting, cache, dan antrean BullMQ. |
| **Object Storage** | S3-compatible (MinIO lokal / Cloudflare R2 produksi) | Signed URL upload langsung dari client untuk aset gambar, font, thumbnail, dan artefak build statis. |
| **Queue & Deploy** | BullMQ (`apps/worker`) + Docker static/Next.js builder | Proses build & export tidak memblokir API HTTP; mendukung log build real-time dan rollback 1 klik. |

## 2. Arsitektur Tingkat Tinggi

```
                  +-----------------------------+
                  |     Browser / Editor UI     |
                  |  Next.js 15 + Konva + Yjs   |
                  +------+---------------+------+
                         |               |
            HTTPS /api/v1|               | WSS (Yjs + Presence)
                         v               v
           +-----------------+       +------------------+
           |  apps/web (API) |       |   apps/collab    |
           | Auth, RBAC, CRUD|       | Hocuspocus + Yjs |
           +--------+--------+       +--------+---------+
                    |                         |
         +----------+----------+--------------+
         |                     |              |
         v                     v              v
  +--------------+     +------------+   +-----------+
  |  PostgreSQL  |     |   Redis    |   | MinIO / R2|
  | (Prisma ORM) |     | Cache/Queue|   |  Assets   |
  +--------------+     +------+-----+   +-----------+
                              |
                              v
                       +-------------+
                       | apps/worker |
                       | BullMQ Jobs |
                       +------+------+
                              |
                              v
            +------------------------------------+
            |  Deploy Engine & Edge Routing      |
            |  {slug}.visone.app + Custom SSL    |
            +------------------------------------+
```

## 3. Strategi Performa Canvas (60fps untuk 5.000+ Layer)
1. **Viewport Frustum Culling:** Hanya node yang bounding box-nya berpotongan dengan viewport aktif (plus margin buffer) yang dikirim ke canvas renderer.
2. **Spatial Indexing (R-Tree / Grid Hash):** Lookup hit-testing saat hover, select, dan marquee drag tidak melakukan linear scan O(N).
3. **Layer Caching & Offscreen Bitmap:** Frame statis atau group kompleks di-cache sebagai offscreen bitmap dan hanya di-invalidate saat properti atau child-nya berubah.
4. **Transient State Separation:** Pergerakan drag/resize berjalan di transient store/canvas layer pada 60fps sebelum di-commit ke Zustand history dan Yjs CRDT doc.

## 4. Keamanan & Non-Fungsional (OWASP Top 10)
- **Validasi Input:** Semua endpoint `/api/v1/*` divalidasi dengan skema Zod dari `@visone/shared`.
- **RBAC Berlapis:** Guard di API route (`assertPlatformPermission`, `assertWorkspacePermission`) dan penyembunyian aksi di UI berdasarkan effective permissions.
- **Enkripsi Data Sensitif:** `EnvVar` dan secret webhook dienkripsi AES-256-GCM menggunakan `ENCRYPTION_KEY` sebelum disimpan ke database.
- **Upload Aman:** Upload aset menggunakan presigned S3 URL dengan batas ukuran, validasi MIME type, dan isolasi bucket.
- **Audit Trail:** Seluruh aksi kritis (undang member, ubah role, deploy production, rollback, hapus resource) dicatat ke `AuditLog`.
