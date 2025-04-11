import app from "@/lib/firebase";
import { getAuth } from "firebase/auth";
import { useNavigate } from "@/router";
import { useAuthState } from "react-firebase-hooks/auth";

export function useAuth(withRedirect: boolean = true) {
  const navigate = useNavigate();
  const auth = getAuth(app);
  const [user] = useAuthState(auth, {
    onUserChanged: async (user) => {
      window.localStorage.setItem("redirect-auth", window.location.href);
      if (!user) {
        if (withRedirect) {
          window.localStorage.removeItem("token");
          // navigate("/login");
        }
      } else {
        const token = await user.getIdToken();
        window.localStorage.setItem("token", token);
      }
    },
  });

  const signOut = async () => {
    await auth.signOut();
    window.localStorage.removeItem("token");
    navigate("/login");
  };

  return { user, signOut, navigate };
}
