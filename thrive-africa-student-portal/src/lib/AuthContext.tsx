import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { auth, db } from './firebase';

interface UserProfile {
  uid: string;
  full_name: string;
  email: string;
  avatar_url?: string;
  role: 'student' | 'mentor' | 'admin';
  programme?: string;
  cohort?: string;
  country?: string;
}

interface AuthContextType {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, profile: null, loading: true });

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubProfile: (() => void) | null = null;

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      if (unsubProfile) {
        unsubProfile();
        unsubProfile = null;
      }
      if (firebaseUser) {
        const profileRef = doc(db, 'users', firebaseUser.uid);
        unsubProfile = onSnapshot(
          profileRef,
          (docSnap) => {
            if (docSnap.exists()) {
              setProfile({ uid: firebaseUser.uid, ...docSnap.data() } as UserProfile);
            } else {
              setProfile(null);
            }
            setLoading(false);
          },
          (error) => {
            console.error('Profile listener error:', error);
            setProfile(null);
            setLoading(false);
          }
        );
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribe();
      if (unsubProfile) unsubProfile();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
