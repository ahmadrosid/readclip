import { Button } from "@/components/ui/button.tsx";
import { Google } from "./icons/google";
import type { UserCredential } from "firebase/auth";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import app, { auth } from "@/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

export function GoogleSignIn({
  label,
  setError,
  onAuthenticated,
  disabled = false,
}: {
  label: string;
  setError: (error: string) => void;
  onAuthenticated?: (credential: UserCredential) => void;
  disabled?: boolean;
}) {
  const [currentUser] = useAuthState(getAuth(app), {
    onUserChanged: async (user) => {
      if (user) {
        const token = await user.getIdToken();
        window.localStorage.setItem("token", token);
      }
    },
  });

  async function handleGoogleLogin() {
    try {
      setError("");
      const user = await signInWithPopup(auth, new GoogleAuthProvider());
      const token = await user.user.getIdToken();
      window.localStorage.setItem("token", token);
      onAuthenticated?.(user);
    } catch (e) {
      if (e instanceof Error) {
        const errorMessage = e.message;
        setError("Failed to log in with Google: " + errorMessage);
      }
    }
  }

  async function handleLogout() {
    try {
      setError("");
      auth.signOut();
    } catch {
      setError("Failed to log out");
    }
  }

  return (
    <div className="gap-2 flex justify-between flex-wrap">
      {currentUser ? (
        <Button
          className="w-full bg-white h-10 dark:bg-gray-600/50 dark:text-gray-300 dark:hover:text-white"
          variant="outline"
          onClick={handleLogout}
          disabled={disabled}
        >
          Logout
        </Button>
      ) : (
        <Button
          disabled={disabled}
          onClick={handleGoogleLogin}
          variant="outline"
          className="h-10 w-full bg-white dark:bg-gray-600/50 dark:text-gray-300 dark:hover:text-white"
        >
          <Google className="mr-2 h-4 w-4" />
          {label}
        </Button>
      )}
    </div>
  );
}
