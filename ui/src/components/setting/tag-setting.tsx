import { Separator } from "@/components/ui/separator";
import { type Tag, fetchAllTags, fetchDeleteTag } from "@/lib/api";
import { useQuery, useMutation } from "react-query";
import { Button } from "../ui/button";
import { RefreshCcw } from "lucide-react";
import { cn } from "@/lib/utils";

function TagItem({ tag, refetch }: { tag: Tag; refetch: () => void }) {
  const deleteTagMutation = useMutation({
    mutationFn: fetchDeleteTag,
    mutationKey: "delete-tag",
    onSuccess: () => refetch(),
    onError: (err) => console.error(err),
  });

  return (
    <div key={tag.Id} className="flex justify-between items-center gap-2">
      <label className="block text-sm text-gray-500">{tag.Name}</label>
      <Button
        variant="ghost"
        size="sm"
        className="text-sm text-red-500"
        onClick={() => {
          deleteTagMutation.mutate(tag.Id);
        }}
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
    <div className="bg-white shadow rounded-lg p-6 space-y-6">
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
        </div>
      </div>
      <Separator className="my-6" />
      <div className="grid gap-2">
        {data?.data.map((tag) => (
          <TagItem key={tag.Id} tag={tag} refetch={refetch} />
        ))}
      </div>
    </div>
  );
}
