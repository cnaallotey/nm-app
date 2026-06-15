import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;

let adminApp: any = null;

if (projectId && clientEmail && privateKey && !privateKey.includes("your-private-key-line-1")) {
  try {
    adminApp =
      getApps()[0] ??
      initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey: privateKey.replace(/\\n/g, "\n").replace(/"/g, ""),
        }),
      });
  } catch (error) {
    console.error("Failed to initialize firebase-admin SDK:", error);
  }
}

export const adminAuth = adminApp ? getAuth(adminApp) : null as any;
export const adminDb = adminApp ? getFirestore(adminApp) : null as any;
