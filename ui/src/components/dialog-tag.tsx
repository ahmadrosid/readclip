import { Article } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SelecTag } from "./select-tag";

type Props = {
  clip?: Article;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function DialogTag({ clip, open, onOpenChange }: Props) {
  if (!clip) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add tag</DialogTitle>
          <DialogDescription>{clip.Title}</DialogDescription>
        </DialogHeader>
        <div>
          <SelecTag clipId={clip.Id} />
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} type="submit">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
