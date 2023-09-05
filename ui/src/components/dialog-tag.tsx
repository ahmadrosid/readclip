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
  article?: Article;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function DialogTag({ article, open, onOpenChange }: Props) {
  if (!article) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add tag</DialogTitle>
          <DialogDescription>{article.Title}</DialogDescription>
        </DialogHeader>
        <div>
          <SelecTag articleId={article.Id} />
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
