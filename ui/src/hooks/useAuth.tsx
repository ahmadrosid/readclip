import app from "@/lib/firebase";
import { getAuth } from "firebase/auth";
import { useNavigate } from "@/router";
import { useAuthState } from "react-firebase-hooks/auth";

export function useAuth() {
  const navigate = useNavigate();
  const auth = getAuth(app);
  const user = useAuthState(auth, {
    onUserChanged: async (user) => {
      if (!user) {
        navigate("/login");
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
