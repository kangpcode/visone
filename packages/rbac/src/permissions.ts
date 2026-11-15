import type { PlatformRole, WorkspaceRole } from "./roles";

export const PLATFORM_PERMISSIONS = [
  "platform:admin_dashboard",
  "platform:users_manage",
  "platform:workspaces_manage",
  "platform:templates_moderate",
  "platform:reports_handle",
  "platform:plans_manage",
  "platform:feature_flags",
  "platform:system_settings",
  "platform:audit_read",
  "platform:health_monitor",
] as const;

export type PlatformPermission = (typeof PLATFORM_PERMISSIONS)[number];

export const WORKSPACE_PERMISSIONS = [
  "workspace:read",
  "workspace:update",
  "workspace:delete",
  "workspace:billing",
  "member:read",
  "member:invite",
  "member:update_role",
  "member:remove",
  "project:read",
  "project:create",
  "project:update",
  "project:delete",
  "file:read",
  "file:create",
  "file:edit",
  "file:delete",
  "file:export",
  "file:share",
  "comment:read",
  "comment:create",
  "comment:resolve",
  "prototype:read",
  "prototype:edit",
  "template:publish",
  "deploy:read",
  "deploy:preview",
  "deploy:production",
  "deploy:rollback",
  "domain:manage",
  "env:manage",
  "apikey:manage",
  "webhook:manage",
  "audit:read",
] as const;

export type WorkspacePermission = (typeof WORKSPACE_PERMISSIONS)[number];

export const PLATFORM_PERMISSION_MATRIX: Record<
  PlatformRole,
  ReadonlySet<PlatformPermission>
> = {
  SUPER_ADMIN: new Set<PlatformPermission>(PLATFORM_PERMISSIONS),
  ADMIN_MODERATOR: new Set<PlatformPermission>([
    "platform:admin_dashboard",
    "platform:users_manage",
    "platform:templates_moderate",
    "platform:reports_handle",
    "platform:audit_read",
    "platform:health_monitor",
  ]),
  USER: new Set<PlatformPermission>([]),
};

const VIEWER_PERMS: WorkspacePermission[] = [
  "workspace:read",
  "member:read",
  "project:read",
  "file:read",
  "file:export",
  "comment:read",
  "prototype:read",
  "deploy:read",
];

const COMMENTER_PERMS: WorkspacePermission[] = [
  ...VIEWER_PERMS,
  "comment:create",
];

const EDITOR_PERMS: WorkspacePermission[] = [
  ...COMMENTER_PERMS,
  "project:create",
  "project:update",
  "file:create",
  "file:edit",
  "file:share",
  "comment:resolve",
  "prototype:edit",
  "template:publish",
  "deploy:preview",
];

const ADMIN_PERMS: WorkspacePermission[] = [
  ...EDITOR_PERMS,
  "workspace:update",
  "member:invite",
  "member:update_role",
  "member:remove",
  "project:delete",
  "file:delete",
  "deploy:production",
  "deploy:rollback",
  "domain:manage",
  "env:manage",
  "apikey:manage",
  "webhook:manage",
  "audit:read",
];

const OWNER_PERMS: WorkspacePermission[] = [
  ...ADMIN_PERMS,
  "workspace:delete",
  "workspace:billing",
];

export const WORKSPACE_PERMISSION_MATRIX: Record<
  WorkspaceRole,
  ReadonlySet<WorkspacePermission>
> = {
  OWNER: new Set<WorkspacePermission>(OWNER_PERMS),
  ADMIN: new Set<WorkspacePermission>(ADMIN_PERMS),
  EDITOR: new Set<WorkspacePermission>(EDITOR_PERMS),
  COMMENTER: new Set<WorkspacePermission>(COMMENTER_PERMS),
  VIEWER: new Set<WorkspacePermission>(VIEWER_PERMS),
  // Guest access is strictly scoped to shared file/prototype view
  GUEST: new Set<WorkspacePermission>(["file:read", "prototype:read", "comment:read"]),
};
