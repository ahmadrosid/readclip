import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useNavigate } from "@/router";
import { useMutation } from "react-query";
import { fetchCreateUser } from "@/lib/api/api";
import { useSignOut } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";
import app from "@/lib/firebase";
import { useCallback } from "react";

export function DialogCreateAccount({
  name,
  email,
  open,
  onOpenChange,
}: {
  email: string;
  name: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const navigate = useNavigate();
  const [logout] = useSignOut(getAuth(app));

  const handleSignout = useCallback(async () => {
    window.localStorage.removeItem("token");
    await logout();
    onOpenChange(false);
  }, [logout, onOpenChange]);

  const registerMutation = useMutation("register", fetchCreateUser, {
    onSuccess: (data) => {
      if (data.status === "success") {
        toast.success("Account created successfully");
        setTimeout(() => {
          navigate("/clip");
        }, 1000);
      }
    },
    onError: (err: Error) => {
      toast.error(err.message);
      if (err.message === "Unauthorized") {
        handleSignout();
        return;
      }
      if (err.message === "User already exists") {
        navigate("/clips");
        return;
      }
      handleSignout();
    },
  });

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Account not found!</AlertDialogTitle>
          <AlertDialogDescription>
            No account associated with {email} would you like to create new
            account?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={(e) => {
              e.preventDefault();
              handleSignout();
            }}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              registerMutation.mutate(name);
            }}
          >
            {registerMutation.isLoading ? "Loading..." : "Yes"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
