import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { useMutation } from "react-query";
import { fetchDeleteUser } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useState } from "react";

export default function GeneralSetting() {
  const { theme, setTheme } = useTheme();
  const { signOut } = useAuth();
  const [open, setOpen] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: fetchDeleteUser,
    mutationKey: "delete-user",
    onSuccess: async () => {
      await signOut();
      setOpen(false);
    },
    onError: (err) => {
      if (err instanceof Error) {
        toast.error(err.message);
      }
    },
  });

  return (
    <div className="bg-white dark:bg-gray-700 dark:border shadow rounded-lg p-6 space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-bold tracking-tight">General</h3>
        <p className="text-muted-foreground">
          Manage your general information.
        </p>
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <p>Select your preferred theme</p>
          <Select onValueChange={setTheme} defaultValue={theme}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-3">
          <p className="text-muted-foreground">Account (Danger Zone)</p>
          <div className="flex justify-between">
            <p>Delete account</p>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button variant={"destructive"}>Delete</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you sure absolutely sure?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. You will lose your data. Are
                    you sure you want to permanently delete your account?
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setOpen(!open)}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={deleteMutation.isLoading}
                    onClick={() => deleteMutation.mutate()}
                  >
                    {deleteMutation.isLoading && (
                      <Loader2 className="animate-spin w-4 h-4 mr-2" />
                    )}
                    Yes delete my account!
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
}
