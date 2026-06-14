/**
 * Seed data for local development.
 *   npm run db:seed   (from repo root)  ──or──  npm run seed --workspace=apps/api
 *
 * `alice` is an ADMIN and is the default stub-auth user (DEV_DEFAULT_USERNAME).
 * Switch the acting user in the stub auth flow with the `x-dev-user` header.
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Clean slate (FK-safe order).
  await prisma.notification.deleteMany();
  await prisma.review.deleteMany();
  await prisma.application.deleteMany();
  await prisma.task.deleteMany();
  await prisma.profile.deleteMany();

  const alice = await prisma.profile.create({
    data: {
      auth0UserId: "stub|alice",
      username: "alice",
      email: "alice@taskboard.dev",
      fullName: "Alice Mensah",
      bio: "Full-stack engineer. Vue & TypeScript. Runs the platform.",
      location: "Accra, GH",
      skills: ["Vue.js", "TypeScript", "Node.js"],
      role: "ADMIN",
    },
  });

  const bob = await prisma.profile.create({
    data: {
      auth0UserId: "stub|bob",
      username: "bob",
      email: "bob@taskboard.dev",
      fullName: "Bob Owusu",
      bio: "Designer who codes. Logos, brand systems, UI.",
      location: "Remote",
      skills: ["Figma", "Branding", "UI Design"],
    },
  });

  const carol = await prisma.profile.create({
    data: {
      auth0UserId: "stub|carol",
      username: "carol",
      email: "carol@taskboard.dev",
      fullName: "Carol Adjei",
      bio: "Backend & data. Postgres, Prisma, pipelines.",
      location: "Kumasi, GH",
      skills: ["PostgreSQL", "Prisma", "Python"],
    },
  });

  const paidTask = await prisma.task.create({
    data: {
      posterId: alice.id,
      title: "Design a logo for TaskBoard",
      description:
        "We need a bold, memorable logo for TaskBoard. Violet/purple palette, works in light and dark. Deliver SVG + usage guide.",
      taskType: "PAID",
      budget: 500,
      currency: "USD",
      skillsRequired: ["Branding", "UI Design"],
      isRemote: true,
      status: "OPEN",
    },
  });

  await prisma.task.create({
    data: {
      posterId: bob.id,
      title: "Help me debug a Prisma migration",
      description:
        "Community favour: my migration keeps failing on a generated column. Looking for a 30-min pairing session.",
      taskType: "COMMUNITY",
      skillsRequired: ["Prisma", "PostgreSQL"],
      isRemote: true,
      status: "OPEN",
    },
  });

  // Bob applies to Alice's paid task.
  await prisma.application.create({
    data: {
      taskId: paidTask.id,
      applicantId: bob.id,
      type: "SELF",
      coverNote:
        "I designed the brand for two startups last year — happy to share my portfolio. I can turn this around in a week.",
      status: "PENDING",
    },
  });

  // Carol nominates Bob for the same task.
  await prisma.application.create({
    data: {
      taskId: paidTask.id,
      applicantId: carol.id,
      type: "NOMINATION",
      nominatedUserId: bob.id,
      coverNote: "Bob is the best brand designer I know — you should grab him.",
      status: "PENDING",
    },
  });

  await prisma.notification.create({
    data: {
      userId: alice.id,
      type: "NEW_APPLICATION",
      payload: {
        taskId: paidTask.id,
        taskTitle: paidTask.title,
        applicantUsername: bob.username,
      },
    },
  });

  console.log("Seed complete: 3 profiles, 2 tasks, 2 applications, 1 notification.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
