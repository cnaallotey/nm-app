import { getApps, initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

if (getApps().length === 0) {
  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  if (serviceAccountKey && serviceAccountKey !== "your_service_account_json_string_here") {
    try {
      const credential = serviceAccountKey.trim().startsWith("{")
        ? cert(JSON.parse(serviceAccountKey))
        : cert(serviceAccountKey);

      initializeApp({
        credential,
      });
    } catch (e) {
      console.error("Failed to initialize Firebase Admin SDK using service account key:", e);
      initializeApp();
    }
  } else {
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    if (projectId && projectId !== "your_firebase_project_id_here") {
      initializeApp({
        projectId,
      });
    } else {
      console.warn("FIREBASE_SERVICE_ACCOUNT_KEY and NEXT_PUBLIC_FIREBASE_PROJECT_ID are missing or placeholders.");
      initializeApp();
    }
  }
}

const adminDb = getFirestore();
const adminAuth = getAuth();

export { adminDb, adminAuth };
