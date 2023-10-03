import app from "@/lib/firebase";
import { getAuth } from "firebase/auth";
import { useNavigate } from "@/router";
import { useAuthState } from "react-firebase-hooks/auth";

export function useAuth() {
  const navigate = useNavigate();
  const user = useAuthState(getAuth(app), {
    onUserChanged: async (user) => {
      if (!user) {
        navigate("/login");
      } else {
        const token = await user.getIdToken();
        window.localStorage.setItem("token", token);
      }
    },
  });

  return { user, navigate };
}
