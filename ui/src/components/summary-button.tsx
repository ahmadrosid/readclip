import { Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
  const summaryMutation = useMutation({
    mutationFn: fetchSummarizeClip,
    mutationKey: "summarize-" + clipId,
    onError: (err: Error) => {
      toast.error(err.message);
    },
    onSuccess: () => onSummarize(),
  });

  const handleSummarization = () => {
    if (clipId === "") return;
    summaryMutation.mutate(clipId);
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={handleSummarization}
            variant="secondary"
            className="px-3 shadow-none hover:bg-gray-300/50 hover:text-gray-600 h-8"
          >
            {summaryMutation.isLoading ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <Sparkles className="h-3 w-3" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent className="bg-gray-800 dark:text-white">
          <p>Generate summary</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
