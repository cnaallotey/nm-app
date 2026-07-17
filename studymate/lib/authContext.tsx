"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { auth, db } from "./firebase";
import { doc, onSnapshot, setDoc } from "firebase/firestore";

// The only email address that has admin privileges in this application.
const ADMIN_EMAIL = "charlesallotey1995@gmail.com";

interface AuthContextType {
  user: User | null;
  profile: any | null;
  loading: boolean;
  isAdmin: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeProfile: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      // Clean up previous profile listener if any
      if (unsubscribeProfile) {
        unsubscribeProfile();
        unsubscribeProfile = null;
      }

      if (currentUser) {
        try {
          const token = await currentUser.getIdToken();
          localStorage.setItem("firebase_id_token", token);

          // Setup real-time listener for the user profile document in Firestore
          const profileRef = doc(db, "users", currentUser.uid);

          unsubscribeProfile = onSnapshot(profileRef, async (docSnap) => {
            if (docSnap.exists()) {
              setProfile(docSnap.data());
              setLoading(false);
            } else {
              // Document doesn't exist yet, initialize it
              const newProfile = {
                uid: currentUser.uid,
                email: currentUser.email,
                displayName: currentUser.displayName || "Learner",
                photoURL: currentUser.photoURL || "",
                plan: "Free",
                status: "active",
                createdAt: new Date(),
              };

              try {
                await setDoc(profileRef, newProfile);
                setProfile(newProfile);
              } catch (setErr) {
                console.error("Failed to initialize user document:", setErr);
              }
              setLoading(false);
            }
          });
        } catch (error) {
          console.error("Failed to retrieve Firebase ID token or profile:", error);
          localStorage.removeItem("firebase_id_token");
          setProfile(null);
          setLoading(false);
        }
      } else {
        localStorage.removeItem("firebase_id_token");
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeProfile) {
        unsubscribeProfile();
      }
    };
  }, []);

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Google Sign-In failed:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed:", error);
      throw error;
    }
  };

  // Admin access is email-gated only. The Firestore `role` field is used for
  // display/audit purposes but is NOT the authority for admin privilege checks.
  const isAdmin = user?.email === ADMIN_EMAIL;

  return (
    <AuthContext.Provider value={{ user, profile, loading, isAdmin, signInWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
