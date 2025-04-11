import { useState } from "react";
import { BookMarkedIcon } from "lucide-react";
import { GoogleSignIn } from "@/components/google-login";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useAuthState } from "react-firebase-hooks/auth";
import app from "@/lib/firebase";
import { getAuth, User } from "firebase/auth";
import { useNavigate } from "@/router";
import { cn } from "@/lib/utils";
import { useMutation } from "react-query";
import { fetchCreateUser } from "@/lib/api/api";

export default function LoginPage() {
  const [loggedUser, setLoggedUser] = useState<User | undefined>();
  const navigate = useNavigate();
  const registerMutation = useMutation("register", fetchCreateUser, {
    onSuccess: (data) => {
      if (data.status === "success") {
        toast.success("Register success!");
        const redirectUrl = window.localStorage.getItem("redirect-auth");
        if (redirectUrl) {
          window.localStorage.removeItem("redirect-auth");
          window.location.href = redirectUrl;
          return;
        }

        navigate("/");
      }
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  useAuthState(getAuth(app), {
    onUserChanged: async (user) => {
      if (user) {
        setLoggedUser(user);
      }
    },
  });

  return (
    <div className="grid p-8 py-16 place-content-center min-h-[80vh]">
      <div className="max-w-md w-full">
        <Card className="overflow-hidden">
          <CardHeader className="space-y-1 text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-gray-200 dark:bg-gray-100/15 p-2 rounded-xl">
                <BookMarkedIcon className="w-6 h-6" />
              </div>
            </div>
            <CardTitle className="text-2xl">Register to ReadClip</CardTitle>
            <CardDescription>
              <span className="tracking-tight px-4 pt-2">Ready to explore? Create your account for free.</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 pt-4 pb-2">
            <GoogleSignIn
              label="Register with Google"
              setError={(error) => {
                if (error == "") return;
                toast.error(error);
              }}
              onAuthenticated={(user) => {
                if (user.user.displayName) {
                  registerMutation.mutate(user.user.displayName);
                }
              }}
            />
          </CardContent>
          <CardFooter>
            <div className="w-full space-y-6 mt-6">
              <Separator className="w-full" />
              <div className="flex justify-center text-sm w-full">
                <p className={`px-2 text-muted-foreground  ${loggedUser ? "opacity-30" : ""}`}>
                  Already have account?
                  <a
                    className={cn(
                      buttonVariants({
                        variant: "link",
                        className: "text-foreground dark:text-gray-300 px-1",
                      })
                    )}
                    href="/login"
                    onClick={(e) => loggedUser && e.preventDefault()}
                    style={{ pointerEvents: loggedUser ? "none" : "auto", opacity: loggedUser ? 0.5 : 1 }}
                  >
                    Login
                  </a>
                </p>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
