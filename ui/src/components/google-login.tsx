import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button.tsx";
import { Google } from "./icons/google";
import type { UserCredential } from "firebase/auth";

export function GoogleSignIn({
  label,
  setError,
  onAuthenticated,
}: {
  label: string;
  setError: (error: string) => void;
  onAuthenticated?: (credential: UserCredential) => void;
}) {
  const { currentUser, googleSignin, logout } = useAuth();

  async function handleGoogleLogin() {
    try {
      setError("");
      const user = await googleSignin();
      console.log("goes here login!");
      const token = await user.user.getIdTokenResult();
      console.log(token);
      window.localStorage.setItem("token", token.token);
      onAuthenticated?.(user);
      console.log("end");
    } catch (e) {
      // TODO: handle error
      if (e instanceof Error) {
        const errorMessage = e.message;
        setError("Failed to log in with Google: " + errorMessage);
      }
    }
  }

  async function handleLogout() {
    try {
      setError("");
      await logout();
    } catch {
      setError("Failed to log out");
    }
  }

  return (
    <div className="gap-2 flex justify-between flex-wrap">
      {currentUser ? (
        <Button
          className="w-full bg-white h-10"
          variant="outline"
          onClick={handleLogout}
        >
          Logout
        </Button>
      ) : (
        <Button
          onClick={handleGoogleLogin}
          variant="outline"
          className="bg-white h-10 w-full"
        >
          <Google className="mr-2 h-4 w-4" />
          {label}
        </Button>
      )}
    </div>
  );
}
