import { describe, expect, it } from "vitest";
import {
  ForbiddenError,
  assertPlatformPermission,
  assertWorkspacePermission,
  getEffectiveWorkspacePermissions,
  hasMinimumWorkspaceRole,
  hasPlatformPermission,
  hasWorkspacePermission,
} from "./index";

describe("@visone/rbac permission matrix", () => {
  it("grants full platform permissions only to SUPER_ADMIN", () => {
    expect(hasPlatformPermission("SUPER_ADMIN", "platform:system_settings")).toBe(true);
    expect(hasPlatformPermission("SUPER_ADMIN", "platform:plans_manage")).toBe(true);

    expect(hasPlatformPermission("ADMIN_MODERATOR", "platform:templates_moderate")).toBe(true);
    expect(hasPlatformPermission("ADMIN_MODERATOR", "platform:reports_handle")).toBe(true);
    expect(hasPlatformPermission("ADMIN_MODERATOR", "platform:plans_manage")).toBe(false);
    expect(hasPlatformPermission("ADMIN_MODERATOR", "platform:system_settings")).toBe(false);

    expect(hasPlatformPermission("USER", "platform:admin_dashboard")).toBe(false);
    expect(() =>
      assertPlatformPermission("USER", "platform:templates_moderate")
    ).toThrow(ForbiddenError);
  });

  it("enforces workspace role boundaries accurately", () => {
    // OWNER vs ADMIN billing/delete boundary
    expect(hasWorkspacePermission("OWNER", "workspace:billing")).toBe(true);
    expect(hasWorkspacePermission("OWNER", "workspace:delete")).toBe(true);
    expect(hasWorkspacePermission("ADMIN", "workspace:billing")).toBe(false);
    expect(hasWorkspacePermission("ADMIN", "workspace:delete")).toBe(false);
    expect(hasWorkspacePermission("ADMIN", "deploy:production")).toBe(true);
    expect(hasWorkspacePermission("ADMIN", "domain:manage")).toBe(true);

    // EDITOR can edit design & preview deploy, but not production deploy or member management
    expect(hasWorkspacePermission("EDITOR", "file:edit")).toBe(true);
    expect(hasWorkspacePermission("EDITOR", "prototype:edit")).toBe(true);
    expect(hasWorkspacePermission("EDITOR", "deploy:preview")).toBe(true);
    expect(hasWorkspacePermission("EDITOR", "deploy:production")).toBe(false);
    expect(hasWorkspacePermission("EDITOR", "member:invite")).toBe(false);

    // COMMENTER can read and comment, cannot edit
    expect(hasWorkspacePermission("COMMENTER", "file:read")).toBe(true);
    expect(hasWorkspacePermission("COMMENTER", "comment:create")).toBe(true);
    expect(hasWorkspacePermission("COMMENTER", "file:edit")).toBe(false);

    // VIEWER is read-only
    expect(hasWorkspacePermission("VIEWER", "file:read")).toBe(true);
    expect(hasWorkspacePermission("VIEWER", "comment:create")).toBe(false);

    // GUEST has limited shared-link view access
    expect(hasWorkspacePermission("GUEST", "file:read")).toBe(true);
    expect(hasWorkspacePermission("GUEST", "prototype:read")).toBe(true);
    expect(hasWorkspacePermission("GUEST", "workspace:read")).toBe(false);
    expect(hasWorkspacePermission("GUEST", "comment:create")).toBe(false);
  });

  it("throws ForbiddenError when assertWorkspacePermission fails", () => {
    expect(() =>
      assertWorkspacePermission("VIEWER", "deploy:preview")
    ).toThrowError(ForbiddenError);
  });

  it("supports role ranking and effective permission listing", () => {
    expect(hasMinimumWorkspaceRole("ADMIN", "EDITOR")).toBe(true);
    expect(hasMinimumWorkspaceRole("COMMENTER", "EDITOR")).toBe(false);

    const guestPerms = getEffectiveWorkspacePermissions("GUEST");
    expect(guestPerms).toEqual(["file:read", "prototype:read", "comment:read"]);
  });
});
