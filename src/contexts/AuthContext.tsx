import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut as firebaseSignOut, onAuthStateChanged, User as FirebaseAuthUser, AuthError } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { auth, createProfile, getProfile, UserProfile } from '../lib/firebaseApi';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string, phone?: string) => Promise<{ error: AuthError | Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | Error | null }>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseAuthUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async (authUser: FirebaseAuthUser) => {
    const profile = await getProfile(authUser.uid);
    setUserProfile(profile);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      setFirebaseUser(authUser);
      if (authUser) {
        await fetchUserProfile(authUser);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName: string, phone?: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create profile document in Firestore (Simulated by createProfile API call)
      const profile = await createProfile(user.uid, email, fullName, phone || null);
      setUserProfile(profile);
      
      return { error: null };
    } catch (authError) {
      return { error: authError as AuthError };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      const profile = await getProfile(user.uid);
      if (profile) {
        setUserProfile(profile);
      } else {
        // Should not happen if signup created the profile
        throw new Error('User profile not found in Firestore.');
      }
      
      return { error: null };
    } catch (authError) {
      return { error: authError as AuthError };
    }
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    setUserProfile(null);
  };

  const isAdmin = userProfile?.role === 'admin';

  const value = {
    user: userProfile,
    loading,
    signUp,
    signIn,
    signOut,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};