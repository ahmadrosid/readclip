import { Separator } from "@/components/ui/separator";
import {
  type Tag,
  fetchAllTags,
  fetchDeleteClipTagAndTag,
} from "@/lib/api/api";
import { useQuery, useMutation } from "react-query";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type TagProps = {
  tag: Tag;
  className?: string;
  refetch: () => void;
};

function TagItem({ tag, className, refetch }: TagProps) {
  const deleteTagMutation = useMutation({
    mutationFn: fetchDeleteClipTagAndTag,
    mutationKey: "delete-tag",
    onSuccess: () => refetch(),
    onError: (err) => {
      if (err instanceof Error) {
        toast.error(err.message);
      }
    },
  });

  return (
    <div
      key={tag.Id}
      className={cn(
        "flex justify-between items-center gap-2 px-2 py-1",
        className
      )}
    >
      <label className="block text-sm text-gray-500">{tag.Name}</label>
      <Button
        variant="ghost"
        size="sm"
        className="text-sm text-red-500"
        onClick={() => deleteTagMutation.mutate(tag.Id)}
      >
        {deleteTagMutation.isLoading ? "Deleting..." : "Delete"}
      </Button>
    </div>
  );
}

export default function TagSetting() {
  const { data, refetch, isLoading } = useQuery({
    queryKey: "fetch-tags",
    queryFn: fetchAllTags,
  });

  return (
    <div className="bg-white dark:bg-gray-700 dark:border shadow rounded-lg p-6 space-y-6">
      <div className="flex justify-between align-top">
        <div className="space-y-2">
          <h3 className="text-lg font-bold tracking-tight">Tags</h3>
          <p className="text-muted-foreground">Manage your tags.</p>
        </div>
        <div>
          <Button variant="ghost" size="sm" onClick={() => refetch()}>
            <RefreshCcw
              className={cn("w-4 h-4", isLoading && "animate-spin")}
            />
          </Button>
          {/* <Button variant="ghost" size="sm" onClick={() => console.log()}>
            <PlusIcon className={cn("w-4 h-4", isLoading && "animate-spin")} />
          </Button> */}
        </div>
      </div>
      <Separator />
      <div className="grid">
        {data?.data.map((tag, idx) => (
          <TagItem
            key={tag.Id}
            tag={tag}
            refetch={refetch}
            className={cn(
              idx % 2 === 0 && "bg-gray-100/70 dark:bg-gray-800/70"
            )}
          />
        ))}
      </div>
    </div>
  );
}
