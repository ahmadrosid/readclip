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

export default function GeneralSetting() {
  const { theme, setTheme } = useTheme();

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
          <p>Select your preferred theme.</p>
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
          <p className="text-muted-foreground">Account</p>
          <div className="flex justify-between">
            <p>Delete account</p>
            <Dialog>
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
                  <Button type="submit" variant="outline">
                    Cancel
                  </Button>
                  <Button type="submit">Yes delete my account!</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
}
