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
import { useNavigate } from "@/router";
import { cn } from "@/lib/utils";
import { useCallback, useEffect } from "react";
import { useMutation } from "react-query";
import { fetchLogin } from "@/lib/api/api";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const { user: loggedUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loggedUser) {
      navigate("/clip");
    }
  }, [loggedUser, navigate]);

  const loginMutation = useMutation("login", fetchLogin, {
    onSuccess: () => {
      const redirectUrl = window.localStorage.getItem("redirect-auth");
      if (redirectUrl) {
        window.localStorage.removeItem("redirect-auth");
        window.location.href = redirectUrl;
        return;
      }
      navigate("/clip");
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  const handleOnAthenticated = useCallback(() => loginMutation.mutate(), [loginMutation]);

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
            <CardTitle className="text-2xl tracking-tight">Sign in to ReadClip</CardTitle>
            <CardDescription>
              <span className="tracking-tight px-4 pt-2">Welcome back! Please sign in to continue.</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 pt-4 pb-2">
            <GoogleSignIn
              label={loginMutation.isLoading ? "Signing in..." : "Continue with Google"}
              setError={(error) => {
                if (error == "") return;
                toast.error(error);
              }}
              onAuthenticated={handleOnAthenticated}
              disabled={loginMutation.isLoading || !!loggedUser}
            />
          </CardContent>
          <CardFooter>
            <div className="w-full space-y-6 mt-6">
              <Separator className="w-full" />
              <div className="flex justify-center text-sm w-full">
                <p className={`px-2 text-muted-foreground  ${loggedUser ? "opacity-30" : ""}`}>
                  Don't have account?
                  <a
                    className={cn(
                      buttonVariants({
                        variant: "link",
                        className: "text-foreground dark:text-gray-300 px-1",
                      })
                    )}
                    href="/register"
                    onClick={(e) => loggedUser && e.preventDefault()}
                    style={{ pointerEvents: loggedUser ? "none" : "auto", opacity: loggedUser ? 0.5 : 1 }}
                  >
                    Create new account
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
