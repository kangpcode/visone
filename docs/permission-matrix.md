# VISONE — Role & Permission Matrix (RBAC)

Implementasi kode sumber berada di [`packages/rbac`](../packages/rbac/src/permissions.ts) dan diuji melalui unit test di [`packages/rbac/src/rbac.test.ts`](../packages/rbac/src/rbac.test.ts).

## 1. Level Platform

| Permission | `SUPER_ADMIN` | `ADMIN_MODERATOR` | `USER` |
|---|:---:|:---:|:---:|
| `platform:admin_dashboard` | Ya | Ya | Tidak |
| `platform:users_manage` | Ya | Ya | Tidak |
| `platform:workspaces_manage` | Ya | Tidak | Tidak |
| `platform:templates_moderate` | Ya | Ya | Tidak |
| `platform:reports_handle` | Ya | Ya | Tidak |
| `platform:plans_manage` | Ya | Tidak | Tidak |
| `platform:feature_flags` | Ya | Tidak | Tidak |
| `platform:system_settings` | Ya | Tidak | Tidak |
| `platform:audit_read` | Ya | Ya | Tidak |
| `platform:health_monitor` | Ya | Ya | Tidak |

## 2. Level Workspace / Team

| Permission | `OWNER` | `ADMIN` | `EDITOR` | `COMMENTER` | `VIEWER` | `GUEST` |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| `workspace:read` | Ya | Ya | Ya | Ya | Ya | Tidak |
| `workspace:update` | Ya | Ya | Tidak | Tidak | Tidak | Tidak |
| `workspace:delete` | Ya | Tidak | Tidak | Tidak | Tidak | Tidak |
| `workspace:billing` | Ya | Tidak | Tidak | Tidak | Tidak | Tidak |
| `member:read` | Ya | Ya | Ya | Ya | Ya | Tidak |
| `member:invite` | Ya | Ya | Tidak | Tidak | Tidak | Tidak |
| `member:update_role` | Ya | Ya | Tidak | Tidak | Tidak | Tidak |
| `member:remove` | Ya | Ya | Tidak | Tidak | Tidak | Tidak |
| `project:read` | Ya | Ya | Ya | Ya | Ya | Tidak |
| `project:create` | Ya | Ya | Ya | Tidak | Tidak | Tidak |
| `project:update` | Ya | Ya | Ya | Tidak | Tidak | Tidak |
| `project:delete` | Ya | Ya | Tidak | Tidak | Tidak | Tidak |
| `file:read` | Ya | Ya | Ya | Ya | Ya | Ya |
| `file:create` | Ya | Ya | Ya | Tidak | Tidak | Tidak |
| `file:edit` | Ya | Ya | Ya | Tidak | Tidak | Tidak |
| `file:delete` | Ya | Ya | Tidak | Tidak | Tidak | Tidak |
| `file:export` | Ya | Ya | Ya | Ya | Ya | Tidak |
| `file:share` | Ya | Ya | Ya | Tidak | Tidak | Tidak |
| `comment:read` | Ya | Ya | Ya | Ya | Ya | Ya |
| `comment:create` | Ya | Ya | Ya | Ya | Tidak | Tidak |
| `comment:resolve` | Ya | Ya | Ya | Tidak | Tidak | Tidak |
| `prototype:read` | Ya | Ya | Ya | Ya | Ya | Ya |
| `prototype:edit` | Ya | Ya | Ya | Tidak | Tidak | Tidak |
| `template:publish` | Ya | Ya | Ya | Tidak | Tidak | Tidak |
| `deploy:read` | Ya | Ya | Ya | Ya | Ya | Tidak |
| `deploy:preview` | Ya | Ya | Ya | Tidak | Tidak | Tidak |
| `deploy:production` | Ya | Ya | Tidak | Tidak | Tidak | Tidak |
| `deploy:rollback` | Ya | Ya | Tidak | Tidak | Tidak | Tidak |
| `domain:manage` | Ya | Ya | Tidak | Tidak | Tidak | Tidak |
| `env:manage` | Ya | Ya | Tidak | Tidak | Tidak | Tidak |
| `apikey:manage` | Ya | Ya | Tidak | Tidak | Tidak | Tidak |
| `webhook:manage` | Ya | Ya | Tidak | Tidak | Tidak | Tidak |
| `audit:read` | Ya | Ya | Tidak | Tidak | Tidak | Tidak |
