import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { PlusIcon } from "lucide-react";
import { Input } from "./ui/input";
import { useState, useCallback } from "react";
import { toast } from "sonner";

export default function CreateNewClip({ setResult }: { setResult: (result: string) => void }) {
  const [open, setOpen] = useState(false);
  const [inputUrl, setInputUrl] = useState("");

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (inputUrl === "https://readclip.site/clips") {
        toast.error("You can't save this url into a clip!");
        return;
      }
      if (inputUrl !== "") {
        setOpen(false);
        setResult(inputUrl);
      }
    },
    [inputUrl, setResult]
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          className="h-12 dark:bg-gray-700 dark:hover:bg-gray-800 text-white"
        >
          <PlusIcon className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add new clip</DialogTitle>
          <DialogDescription>
            <form onSubmit={handleSubmit}>
              <div className="flex gap-2 pt-4">
                <Input
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  type="text"
                  placeholder="https://..."
                  name="web_url"
                  className="bg-white dark:bg-gray-700"
                />
                <Button
                  type="submit"
                  className="dark:bg-gray-700 dark:hover:bg-gray-800 text-white"
                >
                  Submit
                </Button>
              </div>
            </form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
