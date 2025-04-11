import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

type DialogCollectionProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function DialogCollection({ open, onOpenChange }: DialogCollectionProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(false);

  const handleSubmit = () => {
    // TODO: Implement API call
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="dark:bg-gray-800/75">
        <DialogHeader>
          <DialogTitle>New Collection</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter collection name"
              className="col-span-3 dark:bg-gray-700/75 dark:border-gray-600/50"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              placeholder="Enter collection description"
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3 dark:bg-gray-700/75 dark:border-gray-600/50"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="public" className="text-right">
              Public
            </Label>
            <Switch
              id="public"
              checked={isPublic}
              onCheckedChange={setIsPublic}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>
            Create Collection
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
