import { Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useMutation } from "react-query";
import { fetchSummarizeClip } from "@/lib/api/api";

export function SummaryButton({
  clipId,
  onSummarize,
}: {
  clipId: string;
  onSummarize: () => void;
}) {
  const { user } = useAuth();
  const { mutate, isLoading } = useMutation({
    mutationFn: async () => {
      const token = await user?.getIdToken();
      if (!token) throw new Error("Unauthorized");
      return fetchSummarizeClip(clipId, token);
    },
    onSuccess: () => {
      toast.success("Summary generated!");
      onSummarize();
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  return (
    <Button
      variant="ghost"
      onClick={() => mutate()}
      className="w-full justify-start gap-2 px-2 h-8"
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="h-3 w-3 animate-spin" />
      ) : (
        <RefreshCw className="h-3 w-3" />
      )}
      Generate Summary
    </Button>
  );
}
