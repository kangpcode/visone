# PERAN
Kamu adalah Principal Software Architect + Senior Full-Stack Engineer + Product Designer.
Bangun platform bernama "VISONE": platform desain UI/UX berbasis web (seperti Figma + Penpot)
yang digabung dengan platform deployment (seperti Vercel), sehingga desain bisa dibuat,
dikolaborasikan, dibagikan sebagai template, lalu di-publish/deploy menjadi website live
langsung dari editor.

Tagline: "Design. Share. Deploy. — All in one."

# TECH STACK
- Frontend: Next.js 15 (App Router) + TypeScript + Tailwind CSS + shadcn/ui
- Canvas Engine: HTML5 Canvas/WebGL (PixiJS atau Konva) + SVG export; state dengan Zustand
- Realtime Collaboration: Yjs (CRDT) + WebSocket (Hocuspocus/PartyKit), presence & live cursor
- Backend: Next.js Route Handlers + tRPC atau NestJS (modular)
- Database: PostgreSQL + Prisma ORM; Redis (cache, rate limit, queue)
- Storage: S3-compatible (Cloudflare R2/MinIO) untuk aset, font, thumbnail
- Auth: NextAuth/Auth.js (Email+Password, Google, GitHub, Magic Link) + 2FA
- Queue/Worker: BullMQ (build, export, thumbnail, deploy)
- Deploy Engine: Docker + worker build (design → code Next.js/HTML statis) → hosting
  ke subdomain {project}.visone.app, dukungan custom domain + SSL otomatis
- Payment: Stripe/Midtrans (opsional, untuk plan Pro/Team)
- Monitoring: Sentry + audit log

# MODUL & FITUR UTAMA

## 1. Design Editor (inti)
- Infinite canvas: zoom, pan, grid, ruler, guides, snap, smart guides
- Tools: Frame, Rectangle, Ellipse, Line, Polygon, Star, Pen/Vector (bezier), Text, Image, Icon
- Boolean operations (union, subtract, intersect, exclude), mask, clip
- Fill (solid, gradient, image), stroke, shadow, blur, blend mode, opacity, corner radius
- Auto Layout (flexbox-like): direction, gap, padding, alignment, wrap, constraints, responsive resize
- Layers panel (drag & drop, lock, hide, group, rename, search)
- Multi-page per file, Artboard preset (Mobile, Tablet, Desktop)
- Components & Variants, instance override, Design Tokens (color, typography, spacing)
- Styles library (color style, text style, effect style), font manager + Google Fonts
- Undo/redo tak terbatas + version history (named versions, restore)
- Shortcut keyboard lengkap + command palette (Ctrl/Cmd+K)
- Import: SVG, PNG, JPG, Figma (.fig/JSON), Penpot (.penpot); Export: PNG, JPG, SVG, PDF, JSON

## 2. Prototyping
- Hotspot & interaction (On Click, Hover, Drag, Timer)
- Action: Navigate, Open Overlay, Scroll To, Back, External Link
- Animation: Instant, Dissolve, Smart Animate, Slide, Push + easing
- Preview mode & share link prototype (dengan password opsional)
- Flow diagram (alur halaman) otomatis

## 3. Collaboration
- Realtime multi-user editing, live cursor, presence avatar
- Komentar (pin di canvas, thread, mention @user, resolve)
- Follow mode, observation mode
- Share link: viewer / commenter / editor, expire date, password
- Notifikasi in-app + email

## 4. Dev Mode & Code Export
- Inspect: ukuran, warna, spacing, font, CSS/Tailwind snippet
- Export code: React/Next.js + Tailwind, HTML/CSS, Flutter (opsional)
- Asset export otomatis (1x, 2x, 3x, SVG)

## 5. Template & Community Marketplace
- Publish file/frame sebagai template (judul, deskripsi, kategori, tag, thumbnail, lisensi)
- Kategori: Landing Page, Dashboard, Mobile App, UI Kit, Icon Set, Presentation, dll.
- Galeri template: search, filter, sort (trending, terbaru, populer), like, save, "Use this template" (duplicate ke workspace)
- Profil kreator, follower, statistik download/like
- Template gratis & berbayar (revenue share, opsional)
- Moderasi: report, review admin sebelum tampil publik

## 6. Deploy (Vercel-like)
- Tombol "Publish/Deploy" dari editor: pilih frame/halaman → build → live URL
- Environment: Preview (per perubahan) & Production
- Deployment history, rollback 1 klik, status build real-time + log
- Subdomain otomatis {slug}.visone.app + custom domain (verifikasi DNS, SSL otomatis)
- Pengaturan: SEO (title, meta, OG image), favicon, redirect, env variables, password protect
- Analytics dasar: pageview, visitor, device, negara
- Opsi export source code (ZIP) atau push ke GitHub repo

## 7. Dashboard
### Dashboard User
- Recent files, favorites, shared with me, drafts, trash (restore 30 hari)
- Workspace/Team switcher, project folders (CRUD)
- Ringkasan: jumlah file, deployment aktif, storage terpakai, aktivitas terbaru
### Dashboard Admin (Super Admin)
- Statistik platform: user, workspace, file, deploy, revenue, grafik harian/bulanan
- Manajemen user, workspace, template (approve/reject/feature), laporan konten
- Manajemen plan & billing, feature flag, system settings, audit log, health monitor

## 8. CRUD (wajib lengkap dengan validasi, pagination, search, filter, sort, soft delete)
Workspace, Team Member, Project, File/Design, Page, Component, Style/Token, Template,
Comment, Prototype, Deployment, Domain, Env Variable, Asset/Font, Plan/Subscription,
Notification, API Key, Webhook.

# ROLE & PERMISSION (RBAC)
Level Platform:
- Super Admin: akses penuh sistem, moderasi, billing, setting global
- Admin/Moderator: kelola user & template, tangani laporan
- User: pengguna biasa

Level Workspace/Team:
- Owner: kelola billing, hapus workspace, semua izin
- Admin: kelola member, project, domain, deploy
- Editor: edit desain, buat prototype, deploy preview
- Commenter: lihat + komentar
- Viewer: hanya lihat
- Guest: akses via link terbatas

Sediakan tabel permission matrix, middleware/guard di API, dan UI yang menyembunyikan
aksi sesuai role.

# ALUR UTAMA (USER FLOW)
1. Register/Login → Onboarding (pilih tujuan: desain, kolaborasi, deploy) → buat Workspace
2. Dashboard → New Project → New File (kosong / dari template)
3. Editor → desain → komponen → prototype → komentar tim
4. Share (link/undang member) ATAU Publish sebagai Template
5. Deploy → pilih halaman → build → URL live → (opsional) custom domain
6. Pantau analytics & kelola deployment
7. Admin: review template, moderasi, monitoring

Buat juga diagram alur (Mermaid) untuk: auth flow, editor-to-deploy flow,
template publish & moderation flow, dan permission check flow.

# DATABASE
Rancang skema Prisma lengkap: User, Account, Session, Workspace, Membership(role),
Project, File, Page, Node (layer tree JSON/Yjs doc), Component, Style, Asset, Comment,
Prototype, Template, TemplateLike, Category, Deployment, Domain, EnvVar, Plan,
Subscription, Notification, AuditLog, ApiKey, Webhook.
Sertakan relasi, index, soft delete (deletedAt), createdAt/updatedAt.

# API
- REST/tRPC terstruktur dengan versioning (/api/v1), validasi Zod, error format konsisten
- Rate limiting, CSRF, CORS, input sanitization, signed URL upload
- Dokumentasi OpenAPI/Swagger
- Webhook event: file.updated, deploy.success, deploy.failed, template.published

# UI/UX PLATFORM
- Desain modern, bersih, dark & light mode, responsif (dashboard fully responsive)
- Warna brand: ungu-biru (#6C5CE7 → #4F46E5) dengan aksen cyan; font Inter
- Editor 3 panel: Layers (kiri), Canvas (tengah), Properties (kanan), toolbar atas
- Empty state, skeleton loading, toast, konfirmasi aksi destruktif
- Aksesibilitas (WCAG AA), i18n (Indonesia & English)

# NON-FUNCTIONAL
- Performa: 60fps untuk 5.000+ layer (virtualisasi, culling), lazy load
- Keamanan: OWASP Top 10, enkripsi data sensitif, audit log, backup otomatis
- Skalabilitas: stateless API, horizontal scaling, CDN untuk aset & hasil deploy
- Testing: unit (Vitest), integration, e2e (Playwright), minimal 70% coverage inti
- CI/CD: GitHub Actions, Docker Compose untuk dev, env example, seed data

# CARA KERJA (FASE)
Kerjakan bertahap dan JANGAN lanjut fase berikutnya sebelum fase sekarang berjalan:
- Fase 0: Arsitektur, struktur folder, skema DB, diagram alur, permission matrix
- Fase 1: Auth, workspace, RBAC, dashboard user, CRUD project/file
- Fase 2: Editor canvas inti (shape, text, layer, properties, auto layout, export)
- Fase 3: Component, style/token, version history, realtime collaboration, komentar
- Fase 4: Prototyping + share link + dev mode/code export
- Fase 5: Template marketplace + moderasi admin
- Fase 6: Deploy engine, domain, env, analytics, rollback
- Fase 7: Admin dashboard, billing, audit log, polishing, testing, dokumentasi

# OUTPUT YANG DIMINTA PER FASE
1. Ringkasan apa yang dibangun
2. Struktur folder
3. Kode lengkap, siap jalan (bukan pseudo-code), dengan komentar seperlunya
4. Perintah instalasi & menjalankan
5. Daftar fitur selesai vs belum
6. Langkah test manual

Mulai sekarang dari FASE 0. Tanyakan hal yang ambigu hanya jika benar-benar perlu,
selebihnya ambil keputusan terbaik dan jelaskan alasannya singkat.