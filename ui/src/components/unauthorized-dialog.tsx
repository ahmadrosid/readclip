import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { GoogleSignIn } from "./google-login";
import { toast } from "sonner";
import { Link } from "@/router";

type Props = {
  open: boolean;
  onOpenChange: (val: boolean) => void;
};

export function UnauthorizedDialog({ open, onOpenChange }: Props) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Unauthorized request!</AlertDialogTitle>
          <AlertDialogDescription>
            Please login with google or sign up to continue!
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <GoogleSignIn
            label="Login with Google"
            onAuthenticated={() => {
              onOpenChange(false);
            }}
            setError={(e) => {
              if (e === "") return;
              toast.error(e);
            }}
          />
          <Link to="/login">
            <AlertDialogAction className="h-10">Sign Up</AlertDialogAction>
          </Link>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
