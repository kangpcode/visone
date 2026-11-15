import { PrismaClient, PlatformRole, WorkspaceRole } from "@prisma/client";
import { createHash } from "node:crypto";

const prisma = new PrismaClient();

function hashDevPassword(password: string): string {
  // Placeholder deterministic hash for initial Phase 0 seed; Phase 1 uses scrypt/argon2.
  return `sha256:${createHash("sha256").update(password).digest("hex")}`;
}

async function main() {
  console.log("Seeding VISONE database...");

  // 1. Plans
  const plans = [
    {
      code: "free",
      name: "Starter Free",
      description: "Untuk desainer individu dan eksperimen proyek awal.",
      priceMonthlyCents: 0,
      priceYearlyCents: 0,
      limits: {
        maxProjects: 3,
        maxFiles: 10,
        maxMembers: 2,
        maxStorageBytes: 536870912, // 512 MB
        customDomains: 0,
      },
      features: ["Infinite Canvas", "3 Active Projects", "Preview Deployments"],
    },
    {
      code: "pro",
      name: "Pro",
      description: "Untuk kreator & freelancer yang butuh deploy produksi & custom domain.",
      priceMonthlyCents: 1900,
      priceYearlyCents: 18000,
      limits: {
        maxProjects: 50,
        maxFiles: 500,
        maxMembers: 5,
        maxStorageBytes: 10737418240, // 10 GB
        customDomains: 5,
      },
      features: [
        "Unlimited Version History",
        "Custom Domains + Auto SSL",
        "Code Export (Next.js / HTML)",
        "Private Templates",
      ],
    },
    {
      code: "team",
      name: "Team",
      description: "Kolaborasi tim realtime skala penuh, design system, dan RBAC.",
      priceMonthlyCents: 4900,
      priceYearlyCents: 46800,
      limits: {
        maxProjects: -1,
        maxFiles: -1,
        maxMembers: 50,
        maxStorageBytes: 107374182400, // 100 GB
        customDomains: 50,
      },
      features: [
        "Shared Component Library & Tokens",
        "RBAC & Audit Logs",
        "Priority Build Workers",
        "Webhooks & API Keys",
      ],
    },
  ];

  for (const plan of plans) {
    await prisma.plan.upsert({
      where: { code: plan.code },
      update: plan,
      create: plan,
    });
  }

  // 2. Template Categories
  const categories = [
    { name: "Landing Page", slug: "landing-page", icon: "LayoutTemplate", order: 1 },
    { name: "Dashboard", slug: "dashboard", icon: "BarChart3", order: 2 },
    { name: "Mobile App", slug: "mobile-app", icon: "Smartphone", order: 3 },
    { name: "UI Kit", slug: "ui-kit", icon: "Component", order: 4 },
    { name: "Icon Set", slug: "icon-set", icon: "Shapes", order: 5 },
    { name: "Presentation", slug: "presentation", icon: "Presentation", order: 6 },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category,
    });
  }

  // 3. Demo Users
  const superAdmin = await prisma.user.upsert({
    where: { email: "admin@visone.app" },
    update: {},
    create: {
      email: "admin@visone.app",
      name: "VISONE Super Admin",
      username: "visone-admin",
      platformRole: PlatformRole.SUPER_ADMIN,
      passwordHash: hashDevPassword("Admin123!"),
      emailVerified: new Date(),
      onboardingGoal: "collaborate",
    },
  });

  const demoUser = await prisma.user.upsert({
    where: { email: "designer@visone.app" },
    update: {},
    create: {
      email: "designer@visone.app",
      name: "Nadia Pratama",
      username: "nadiapratama",
      platformRole: PlatformRole.USER,
      passwordHash: hashDevPassword("Designer123!"),
      emailVerified: new Date(),
      onboardingGoal: "design_and_deploy",
    },
  });

  // 4. Demo Workspace + Membership + Subscription
  const workspace = await prisma.workspace.upsert({
    where: { slug: "visone-studio" },
    update: {},
    create: {
      name: "VISONE Studio",
      slug: "visone-studio",
      description: "Workspace starter untuk desain & deployment pertama.",
      ownerId: demoUser.id,
    },
  });

  await prisma.membership.upsert({
    where: {
      workspaceId_userId: {
        workspaceId: workspace.id,
        userId: demoUser.id,
      },
    },
    update: { role: WorkspaceRole.OWNER },
    create: {
      workspaceId: workspace.id,
      userId: demoUser.id,
      role: WorkspaceRole.OWNER,
    },
  });

  await prisma.membership.upsert({
    where: {
      workspaceId_userId: {
        workspaceId: workspace.id,
        userId: superAdmin.id,
      },
    },
    update: { role: WorkspaceRole.ADMIN },
    create: {
      workspaceId: workspace.id,
      userId: superAdmin.id,
      role: WorkspaceRole.ADMIN,
    },
  });

  const freePlan = await prisma.plan.findUnique({ where: { code: "free" } });
  if (freePlan) {
    const existingSub = await prisma.subscription.findFirst({
      where: { workspaceId: workspace.id },
    });
    if (!existingSub) {
      await prisma.subscription.create({
        data: {
          workspaceId: workspace.id,
          planId: freePlan.id,
        },
      });
    }
  }

  // 5. Starter Project & File
  const project = await prisma.project.upsert({
    where: {
      workspaceId_slug: {
        workspaceId: workspace.id,
        slug: "starter-landing",
      },
    },
    update: {},
    create: {
      workspaceId: workspace.id,
      name: "Starter Landing Page",
      slug: "starter-landing",
      description: "Proyek contoh untuk editor dan deploy.",
      color: "#6C5CE7",
    },
  });

  const existingFile = await prisma.file.findFirst({
    where: { projectId: project.id, name: "Homepage Hero v1" },
  });

  if (!existingFile) {
    const file = await prisma.file.create({
      data: {
        workspaceId: workspace.id,
        projectId: project.id,
        createdById: demoUser.id,
        name: "Homepage Hero v1",
        slug: "homepage-hero-v1",
        isDraft: false,
      },
    });

    await prisma.page.create({
      data: {
        fileId: file.id,
        name: "Desktop - 1440",
        order: 0,
        backgroundColor: "#F5F6FA",
      },
    });
  }

  console.log("Seed completed successfully.");
}

main()
  .catch((err) => {
    console.error("Seed error:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
