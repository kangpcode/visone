# VISONE — Diagram Alur Sistem (Mermaid)

## 1. Auth Flow (Register, Login, OAuth, 2FA & Onboarding)

```mermaid
flowchart TD
    A["Pengguna Buka VISONE"] --> B{"Sudah Punya Akun?"}
    B -- "Belum" --> C["Pilih Metode Daftar: Email/Password, Google, GitHub, Magic Link"]
    B -- "Sudah" --> D["Login Kredensial / OAuth / Magic Link"]
    C --> E["Verifikasi Email / Token"]
    E --> F["Buat User di PostgreSQL"]
    D --> G{"2FA Aktif?"}
    G -- "Ya" --> H["Verifikasi TOTP 2FA"]
    G -- "Tidak" --> I["Terbitkan Session / JWT"]
    H --> I
    F --> J["Onboarding: Pilih Tujuan (Desain, Kolaborasi, Deploy)"]
    J --> K["Buat Workspace Default + Membership OWNER"]
    K --> L["Masuk Dashboard User"]
    I --> M{"Sudah Punya Workspace?"}
    M -- "Belum" --> J
    M -- "Sudah" --> L
```

## 2. Editor-to-Deploy Flow

```mermaid
flowchart LR
    A["Editor Canvas (Konva + Zustand)"] --> B["Sinkronisasi CRDT via Yjs (apps/collab)"]
    B --> C["Simpan Snapshot Node & Page ke PostgreSQL"]
    A --> D["Klik Publish / Deploy"]
    D --> E{"Cek Izin RBAC"}
    E -- "EDITOR" --> F["Izinkan Deploy Environment: PREVIEW"]
    E -- "ADMIN / OWNER" --> G["Izinkan PREVIEW atau PRODUCTION"]
    F --> H["Buat Record Deployment (QUEUED)"]
    G --> H
    H --> I["Antrekan Job ke BullMQ (Redis)"]
    I --> J["apps/worker: Generate Code Next.js / HTML Statis"]
    J --> K["Build & Inject EnvVar Terenkripsi + SEO Config"]
    K --> L{"Build Sukses?"}
    L -- "Gagal" --> M["Update Status FAILED + Simpan Build Logs + Notifikasi"]
    L -- "Sukses" --> N["Upload Artefak ke S3/R2 + Aktifkan Routing"]
    N --> O["Update Status DEPLOYED: {slug}.visone.app / Custom Domain"]
    O --> P["Kirim Webhook deploy.success & Catat AuditLog"]
```

## 3. Template Publish & Moderation Flow

```mermaid
flowchart TD
    A["Editor / Owner Pilih File atau Frame"] --> B["Klik Publish as Template"]
    B --> C{"Cek Izin template:publish"}
    C -- "Ditolak" --> D["HTTP 403 Forbidden"]
    C -- "Diizinkan" --> E["Isi Judul, Deskripsi, Kategori, Tag, Lisensi, Harga"]
    E --> F["Generate Thumbnail via Worker + Simpan Snapshot"]
    F --> G["Simpan Template dengan Status PENDING_REVIEW"]
    G --> H["Masuk Antrean Moderasi Admin / Moderator"]
    H --> I{"Keputusan Moderator"}
    I -- "Reject" --> J["Status REJECTED + Alasan Penolakan ke Kreator"]
    I -- "Approve" --> K["Status APPROVED (+ Opsional Featured)"]
    K --> L["Tampil di Marketplace Publik"]
    L --> M["Pengguna Lain Klik 'Use this template'"]
    M --> N["Duplikasi File & Node Tree ke Workspace Pengguna"]
    L --> O["Jika Ada Laporan Konten -> TemplateReport OPEN -> Review Ulang"]
```

## 4. Permission Check Flow (API Guard & UI Visibility)

```mermaid
flowchart TD
    A["Incoming Request (/api/v1/*) atau Aksi UI"] --> B{"Jenis Kredensial?"}
    B -- "Session Cookie" --> C["Ambil User + PlatformRole"]
    B -- "API Key Header" --> D["Validasi KeyHash + Scope ApiKey"]
    B -- "Share Token Link" --> E["Validasi Token, Expiry & Password ShareLink"]
    B -- "Tidak Ada" --> F["HTTP 401 Unauthorized"]
    C --> G{"Endpoint Level Platform?"}
    G -- "Ya" --> H["Cek PLATFORM_PERMISSION_MATRIX[platformRole]"]
    H -- "Tidak Cocok" --> I["HTTP 403 Forbidden"]
    H -- "Cocok" --> J["Eksekusi Handler"]
    G -- "Tidak (Level Workspace)" --> K{"User SUPER_ADMIN?"}
    K -- "Ya" --> J
    K -- "Tidak" --> L["Ambil Membership(workspaceId, userId)"]
    E --> M["Terapkan Role Terbatas ShareLink (VIEWER / COMMENTER / EDITOR / GUEST)"]
    L --> N["Cek WORKSPACE_PERMISSION_MATRIX[role]"]
    M --> N
    D --> N
    N -- "Tidak Cocok" --> I
    N -- "Cocok" --> J
```
