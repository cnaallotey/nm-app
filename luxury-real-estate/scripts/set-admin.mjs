import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import fs from "fs";

// Load .env.local manually
if (fs.existsSync(".env.local")) {
  const envFile = fs.readFileSync(".env.local", "utf-8");
  envFile.split("\n").forEach((line) => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || "";
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.substring(1, value.length - 1);
      }
      process.env[key] = value;
    }
  });
}

const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;

if (!projectId || !clientEmail || !privateKey) {
  console.error("❌ Error: Missing Firebase Admin credentials in .env.local");
  process.exit(1);
}

initializeApp({
  credential: cert({
    projectId,
    clientEmail,
    privateKey: privateKey.replace(/\\n/g, "\n"),
  }),
});

const email = process.argv[2];
if (!email) {
  console.error("❌ Error: Please specify user email. Example: node scripts/set-admin.mjs user@example.com");
  process.exit(1);
}

try {
  const user = await getAuth().getUserByEmail(email);
  await getAuth().setCustomUserClaims(user.uid, { admin: true });
  console.log(`✅ ${email} is now an admin user`);
  process.exit(0);
} catch (error) {
  console.error("❌ Failed to set admin claim:", error);
  process.exit(1);
}
