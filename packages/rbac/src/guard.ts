import {
  PLATFORM_PERMISSION_MATRIX,
  WORKSPACE_PERMISSION_MATRIX,
  type PlatformPermission,
  type WorkspacePermission,
} from "./permissions";
import {
  PLATFORM_ROLE_RANK,
  WORKSPACE_ROLE_RANK,
  type PlatformRole,
  type WorkspaceRole,
} from "./roles";

export class ForbiddenError extends Error {
  public readonly statusCode = 403;
  public readonly code = "FORBIDDEN";

  constructor(message = "Insufficient permissions to perform this action") {
    super(message);
    this.name = "ForbiddenError";
  }
}

export function hasPlatformPermission(
  role: PlatformRole | null | undefined,
  permission: PlatformPermission
): boolean {
  if (!role) return false;
  return PLATFORM_PERMISSION_MATRIX[role]?.has(permission) ?? false;
}

export function hasWorkspacePermission(
  role: WorkspaceRole | null | undefined,
  permission: WorkspacePermission,
  platformRole?: PlatformRole | null
): boolean {
  // Super Admin has emergency platform-wide override capability when explicitly acting as platform admin
  if (platformRole === "SUPER_ADMIN") {
    return true;
  }
  if (!role) return false;
  return WORKSPACE_PERMISSION_MATRIX[role]?.has(permission) ?? false;
}

export function assertPlatformPermission(
  role: PlatformRole | null | undefined,
  permission: PlatformPermission
): void {
  if (!hasPlatformPermission(role, permission)) {
    throw new ForbiddenError(
      `Missing platform permission: ${permission}`
    );
  }
}

export function assertWorkspacePermission(
  role: WorkspaceRole | null | undefined,
  permission: WorkspacePermission,
  platformRole?: PlatformRole | null
): void {
  if (!hasWorkspacePermission(role, permission, platformRole)) {
    throw new ForbiddenError(
      `Missing workspace permission: ${permission}`
    );
  }
}

export function hasMinimumWorkspaceRole(
  actual: WorkspaceRole | null | undefined,
  minimum: WorkspaceRole
): boolean {
  if (!actual) return false;
  return WORKSPACE_ROLE_RANK[actual] >= WORKSPACE_ROLE_RANK[minimum];
}

export function hasMinimumPlatformRole(
  actual: PlatformRole | null | undefined,
  minimum: PlatformRole
): boolean {
  if (!actual) return false;
  return PLATFORM_ROLE_RANK[actual] >= PLATFORM_ROLE_RANK[minimum];
}

export function getEffectiveWorkspacePermissions(
  role: WorkspaceRole | null | undefined,
  platformRole?: PlatformRole | null
): WorkspacePermission[] {
  if (platformRole === "SUPER_ADMIN") {
    return Array.from(WORKSPACE_PERMISSION_MATRIX.OWNER);
  }
  if (!role) return [];
  return Array.from(WORKSPACE_PERMISSION_MATRIX[role] ?? []);
}
