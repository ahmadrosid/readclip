import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { fetchUpdateClip } from "@/lib/api/api";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface DialogEditClipProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  content: string;
  clipId: string;
}

export function DialogEditClip({
  open,
  onOpenChange,
  title: initialTitle,
  content: initialContent,
  clipId,
}: DialogEditClipProps) {
  const { user } = useAuth();
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Unauthorized");
      const token = await user.getIdToken();
      return fetchUpdateClip({
        id: clipId,
        title,
        content,
        token,
      });
    },
    onSuccess: (response) => {
      toast.success("Clip updated successfully!");
      // Update both the clip data and the markdown data
      queryClient.setQueryData(["clip", clipId], response);
      queryClient.setQueryData(["fetchMarkdown", clipId], response);
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast.error(`Failed to update clip: ${error.message}`);
    },
  });

  const handleSave = () => {
    if (!title.trim() || !content.trim()) {
      toast.error("Title and content are required");
      return;
    }
    updateMutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[725px]">
        <DialogHeader>
          <DialogTitle>Edit Clip</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Input
              id="title"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full"
              disabled={updateMutation.isLoading}
            />
          </div>
          <div className="space-y-2">
            <Textarea
              id="content"
              placeholder="Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[300px]"
              disabled={updateMutation.isLoading}
            />
          </div>
        </div>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={updateMutation.isLoading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={updateMutation.isLoading}
          >
            {updateMutation.isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save changes'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
