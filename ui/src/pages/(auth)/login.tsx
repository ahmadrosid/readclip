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
import { useCallback, useEffect, useState } from "react";
import type { UserCredential } from "firebase/auth";
import { DialogCreateAccount } from "@/components/dialog-create-account";
import { useMutation } from "react-query";
import { fetchLogin } from "@/lib/api";

export default function LoginPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    email: "",
  });
  const [open, setOpen] = useState(false);

  const loginMutation = useMutation("login", fetchLogin, {
    onSuccess: (data) => {
      if (data.status === "success" && data.data !== null) {
        navigate("/clip");
      }
    },
    onError: (err: Error) => {
      console.log(err);
      if (err.message === "user not found") {
        setOpen(true);
        return;
      }
      toast.error(err.message);
    },
  });

  const handleOnAthenticated = useCallback(
    (credential: UserCredential) => {
      setUser({
        name: credential.user.displayName ?? "",
        email: credential.user.email ?? "",
      });
      loginMutation.mutate();
    },
    [loginMutation]
  );

  useEffect(() => {
    const hasToken = window.localStorage.getItem("token");
    if (hasToken && !loginMutation.isLoading) {
      navigate("/");
    }
  }, [loginMutation.isLoading, navigate]);

  return (
    <div className="grid p-8 py-16 place-content-center min-h-[80vh]">
      <DialogCreateAccount
        email={user.email}
        name={user.name}
        open={open}
        onOpenChange={setOpen}
      />
      <div className="max-w-md w-full">
        <Card className="overflow-hidden">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl">Sign in to ReadClip</CardTitle>
            <CardDescription>
              Start your reading journey by logging in to your account.
            </CardDescription>
          </CardHeader>
          <Separator />
          <CardContent className="grid gap-4 pt-4 pb-2 bg-gray-100/75 dark:bg-gray-200">
            <GoogleSignIn
              label="Continue with Google"
              setError={(error) => {
                if (error == "") return;
                toast.error(error);
              }}
              onAuthenticated={handleOnAthenticated}
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
                  href="/register"
                >
                  Or create new account!
                </a>
              </span>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
