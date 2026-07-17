import { getApps, initializeApp, cert, getApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

let app: any = null;

function getAdminApp() {
  if (app) return app;

  if (getApps().length > 0) {
    app = getApp();
    return app;
  }

  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  try {
    if (
      serviceAccountKey &&
      serviceAccountKey.trim() !== "" &&
      serviceAccountKey !== "your_service_account_json_string_here"
    ) {
      let parsedKey;
      if (serviceAccountKey.trim().startsWith("{")) {
        parsedKey = JSON.parse(serviceAccountKey);
        // Replace escaped newline characters which can occur when pasted into cloud environment forms
        if (parsedKey.private_key) {
          parsedKey.private_key = parsedKey.private_key.replace(/\\n/g, "\n");
        }
      } else {
        parsedKey = serviceAccountKey;
      }

      app = initializeApp({
        credential: cert(parsedKey),
      });
      console.log("Firebase Admin SDK successfully initialized using Service Account Key.");
    } else {
      const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
      if (projectId && projectId !== "your_firebase_project_id_here") {
        app = initializeApp({
          projectId,
        });
        console.log(`Firebase Admin SDK initialized using project ID fallback: ${projectId}`);
      } else {
        console.warn("FIREBASE_SERVICE_ACCOUNT_KEY and NEXT_PUBLIC_FIREBASE_PROJECT_ID are missing or placeholders. Using default credentials.");
        app = initializeApp();
      }
    }
  } catch (err) {
    console.error("Failed to initialize Firebase Admin SDK. Trying fallback initialization:", err);
    try {
      app = initializeApp();
    } catch (fallbackErr) {
      console.error("Firebase Admin fallback initialization error:", fallbackErr);
      app = getApp();
    }
  }

  return app;
}

let _db: any = null;
function getDb() {
  if (!_db) {
    _db = getFirestore(getAdminApp());
  }
  return _db;
}

let _auth: any = null;
function getAuthInstance() {
  if (!_auth) {
    _auth = getAuth(getAdminApp());
  }
  return _auth;
}

// Lazy initialization proxies. Deferring authentication and service configuration 
// to API route request runtime ensures that any setup failures are caught inside 
// the handler's try/catch block rather than causing module load-time crashes.
export const adminDb = new Proxy({} as any, {
  get(target, prop) {
    const db = getDb();
    const val = Reflect.get(db, prop);
    if (typeof val === "function") {
      return val.bind(db);
    }
    return val;
  },
});

export const adminAuth = new Proxy({} as any, {
  get(target, prop) {
    const auth = getAuthInstance();
    const val = Reflect.get(auth, prop);
    if (typeof val === "function") {
      return val.bind(auth);
    }
    return val;
  },
});
