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
import { getAuth } from "firebase/auth";
import { useNavigate } from "@/router";
import { cn } from "@/lib/utils";
import { useMutation } from "react-query";
import { fetchCreateUser } from "@/lib/api";

export default function LoginPage() {
  const navigate = useNavigate();
  const registerMutation = useMutation("register", fetchCreateUser, {
    onSuccess: (data) => {
      if (data.status === "success") {
        toast.success("Register success!");
        navigate("/");
      }
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  useAuthState(getAuth(app), {
    onUserChanged: async (user) => {
      const hasToken = window.localStorage.getItem("token");
      if (user && hasToken && !registerMutation.isLoading) {
        navigate("/");
      }
    },
  });

  return (
    <div className="grid p-8 py-16 place-content-center min-h-[80vh]">
      <div className="max-w-md w-full">
        <Card className="overflow-hidden">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl">Register to ReadClip</CardTitle>
            <CardDescription>
              Start your reading journey by create new account.
            </CardDescription>
          </CardHeader>
          <Separator />
          <CardContent className="grid gap-4 pt-4 pb-2 bg-gray-100/75 dark:bg-gray-200">
            <GoogleSignIn
              label="Register with Google"
              setError={(error) => {
                if (error == "") return;
                toast.error(error);
              }}
              onAuthenticated={(user) => {
                console.log("goes here!, onAuthenticated");
                if (user.user.displayName) {
                  registerMutation.mutate(user.user.displayName);
                }
              }}
            />
          </CardContent>
          <CardFooter className="bg-gray-100/75 dark:bg-gray-200">
            <div className="flex justify-center text-sm w-full">
              <span className="px-2 text-muted-foreground">
                <a
                  className={cn(
                    buttonVariants({
                      variant: "link",
                      className: "text-muted-foreground dark:text-gray-600",
                    })
                  )}
                  href="/login"
                >
                  Already have account? Login here!
                </a>
              </span>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
