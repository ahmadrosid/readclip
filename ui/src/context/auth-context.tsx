import React, { useContext, useState, useEffect } from "react";
import { auth } from "../lib/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import type { User, UserCredential } from "firebase/auth";

interface IAuthProviderProps {
  children: JSX.Element;
}

interface AuthContextProps {
  currentUser: User | null;
  googleSignin: () => Promise<UserCredential>;
  logout: () => Promise<void>;
}
const AuthContext = React.createContext<AuthContextProps | undefined>(
  undefined
);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: IAuthProviderProps): JSX.Element {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  function googleSignin(): Promise<UserCredential> {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  }

  async function logout(): Promise<void> {
    auth.signOut().finally(() => {
      setCurrentUser(null);
    });
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setLoading(false);
      if (user) {
        setCurrentUser({ ...user, providerData: [] });
        user.getIdToken().then(() => {
          // TODO: save token to local storage
        });
      }
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    googleSignin,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
