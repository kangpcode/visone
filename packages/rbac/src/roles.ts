export const PLATFORM_ROLES = ["SUPER_ADMIN", "ADMIN_MODERATOR", "USER"] as const;
export type PlatformRole = (typeof PLATFORM_ROLES)[number];

export const WORKSPACE_ROLES = [
  "OWNER",
  "ADMIN",
  "EDITOR",
  "COMMENTER",
  "VIEWER",
  "GUEST",
] as const;
export type WorkspaceRole = (typeof WORKSPACE_ROLES)[number];

export const WORKSPACE_ROLE_RANK: Record<WorkspaceRole, number> = {
  OWNER: 60,
  ADMIN: 50,
  EDITOR: 40,
  COMMENTER: 30,
  VIEWER: 20,
  GUEST: 10,
};

export const PLATFORM_ROLE_RANK: Record<PlatformRole, number> = {
  SUPER_ADMIN: 30,
  ADMIN_MODERATOR: 20,
  USER: 10,
};
