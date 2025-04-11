import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Collection } from "@/lib/types";

type DialogCollectionSelectProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  collections: Collection[];
  clipId: string;
  currentCollectionIds: string[];
};

export function DialogCollectionSelect({
  open,
  onOpenChange,
  collections,
  clipId,
  currentCollectionIds,
}: DialogCollectionSelectProps) {
  const [selectedCollections, setSelectedCollections] = useState<string[]>(
    currentCollectionIds
  );

  const handleToggleCollection = (collectionId: string) => {
    setSelectedCollections((prev) =>
      prev.includes(collectionId)
        ? prev.filter((id) => id !== collectionId)
        : [...prev, collectionId]
    );
  };

  const handleSubmit = () => {
    // TODO: Implement API call to update collections
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="dark:bg-gray-800/75">
        <DialogHeader>
          <DialogTitle>Add to Collections</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {collections.map((collection) => (
            <div key={collection.id} className="flex items-center space-x-2">
              <Checkbox
                id={collection.id}
                checked={selectedCollections.includes(collection.id)}
                onCheckedChange={() => handleToggleCollection(collection.id)}
              />
              <Label htmlFor={collection.id} className="cursor-pointer">
                {collection.name}
              </Label>
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
