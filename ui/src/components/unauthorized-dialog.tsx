import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Link } from "@/router";
import { Button } from "./ui/button";

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
            Please sign in to continue, or create new account!
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Link to="/login">
            <Button className="h-10" variant="outline">
              Sign In
            </Button>
          </Link>
          <Link to="/register">
            <Button className="h-10">Sign Up</Button>
          </Link>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
