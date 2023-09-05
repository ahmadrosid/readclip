import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button.tsx";
import { Google } from "./icons/google";

export function GoogleSignIn({
  setError,
}: {
  setError: (error: string) => void;
}) {
  const { currentUser, googleSignin, logout } = useAuth();

  async function handleGoogleLogin(): Promise<void> {
    try {
      setError("");
      await googleSignin();
      // TODO: authenticate to backend
    } catch (e) {
      // TODO: handle error
      if (e instanceof Error) {
        const errorMessage = e.message;
        setError("Failed to log in with Google: " + errorMessage);
      }
    }
  }

  async function handleLogout(): Promise<void> {
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
          Continue with Google
        </Button>
      )}
    </div>
  );
}
