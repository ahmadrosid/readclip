import { GoogleSignIn } from "@/components/google-login";
import { Button } from "@/components/ui/button";
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

export default function LoginPage() {
  const navigate = useNavigate();
  useAuthState(getAuth(app), {
    onUserChanged: async (user) => {
      if (user) {
        navigate("/");
        user.getIdToken().then((token) => {
          console.log(token);
        });
      }
    },
  });

  return (
    <div className="grid p-8 place-content-center">
      <div className="max-w-md w-full">
        <Card className="overflow-hidden">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl">Sign in to ReadClip</CardTitle>
            <CardDescription>
              Start your reading journey by logging in to your account.
            </CardDescription>
          </CardHeader>
          <Separator />
          <CardContent className="grid gap-4 pt-4 pb-2 bg-gray-100/75">
            <GoogleSignIn
              setError={(error) => {
                if (error == "") return;
                toast.error(error);
              }}
            />
          </CardContent>
          <CardFooter className="bg-gray-100/75">
            <div className="flex justify-center text-sm w-full">
              <span className="px-2 text-muted-foreground">
                Or create{" "}
                <Button
                  variant="link"
                  className="px-0 text-muted-foreground underline hover:text-foreground"
                >
                  new account!
                </Button>
              </span>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
