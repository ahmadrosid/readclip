import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandList,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Check, Loader2, PlusIcon, XIcon } from "lucide-react";
import { useQuery, useMutation } from "react-query";
import {
  AddArticleTagRequest,
  AddArticleTagResponse,
  Tag,
  fetchAddrticleTag,
  fetchAllTags,
  fetchClipTags,
  fetchCreateTag,
  fetchDeleteClipTag,
} from "@/lib/api";
import { useCommandState } from "cmdk";
import { toast } from "sonner";

type CommandProps = {
  tags: Tag[];
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedValues: Set<string>;
  setSelectedValues: React.Dispatch<React.SetStateAction<Set<string>>>;
  mutate: (value: string) => void;
  onAddArticleTag: (label: string) => void;
};

function RenderEmptyState({
  handleAddNewTag,
}: {
  handleAddNewTag: (value: string) => void;
}) {
  const isNotEmpty = useCommandState((state) => state.filtered.count > 0);
  const search = useCommandState((state) => state.search);
  if (isNotEmpty) {
    return null;
  }

  return (
    <button
      onClick={() => handleAddNewTag(search)}
      className="hover:bg-secondary w-full rounded p-3 inline-flex gap-2 items-center text-sm"
    >
      <PlusIcon className="h-4 w-4" />
      Create label "{search}"
    </button>
  );
}

function CommanSearchTag({
  tags,
  selectedValues,
  setSelectedValues,
  setOpen,
  mutate,
  onAddArticleTag,
}: CommandProps) {
  const handleAddNewTag = React.useCallback(
    (label: string) => {
      if (label.length === 0) {
        return;
      }
      const hasCurrentOptions = tags.some((option) =>
        option.Name.includes(label)
      );
      if (hasCurrentOptions) {
        return;
      }
      setSelectedValues((prev) => {
        const next = new Set<string>(prev);
        next.add(label);
        return next;
      });
      mutate(label);

      setOpen(false);
    },
    [tags, setSelectedValues, mutate, setOpen]
  );

  const handleSelectedItem = React.useCallback(
    (currentValue: string, item: Tag) => {
      if (selectedValues.has(item.Name)) {
        setOpen(false);
        return;
      }
      setSelectedValues((prev) => {
        const next = new Set<string>(prev);
        next.add(currentValue);
        return next;
      });
      onAddArticleTag(item.Id);
      setOpen(false);
    },
    [selectedValues, setSelectedValues, onAddArticleTag, setOpen]
  );

  return (
    <Command>
      <CommandInput placeholder="Type to search or add new tag!" />
      <RenderEmptyState handleAddNewTag={handleAddNewTag} />
      <CommandList>
        {tags.map((item) => (
          <CommandItem
            key={item.Name}
            onSelect={(value) => handleSelectedItem(value, item)}
          >
            {selectedValues.has(item.Name) ? (
              <>
                <Check className="mr-2 h-4 w-4" /> {item.Name}
              </>
            ) : (
              <span className="pl-6">{item.Name}</span>
            )}
          </CommandItem>
        ))}
      </CommandList>
    </Command>
  );
}

export function BadgeSelected({
  value,
  tags,
  refetch,
  setSelectedValues,
}: {
  tags: Tag[];
  value: string;
  refetch: () => void;
  setSelectedValues: React.Dispatch<React.SetStateAction<Set<string>>>;
}) {
  const deleteTagMutation = useMutation({
    mutationFn: fetchDeleteClipTag,
    mutationKey: "select-delete-tag",
    onSuccess: () => refetch(),
    onError: (err) => {
      if (err instanceof Error) {
        toast.error(err.message);
      }
    },
  });

  const handleDeletedSelectedBylabel = React.useCallback(
    async (label: string) => {
      if (deleteTagMutation.isLoading) {
        return;
      }

      const tag = tags.filter((tag) => tag.Name === label)[0];
      if (tag) {
        await deleteTagMutation.mutateAsync(tag.Id);

        setSelectedValues((prev) => {
          const next = new Set<string>(prev);
          next.delete(label);
          return next;
        });
      }
    },
    [deleteTagMutation, setSelectedValues, tags]
  );

  return (
    <Badge
      variant="secondary"
      key={value}
      onClick={() => handleDeletedSelectedBylabel(value)}
      className="rounded-sm font-normal cursor-pointer pr-1 pl-1.5"
    >
      {value}
      {deleteTagMutation.isLoading ? (
        <Loader2 className="ml-1 h-3 w-3 animate-spin" />
      ) : (
        <XIcon className="ml-1 h-3 w-3" />
      )}
    </Badge>
  );
}

export function SelecTag({ clipId }: { clipId: string }) {
  const [tags, setTags] = React.useState<Tag[]>([]);
  const [open, setOpen] = React.useState(false);
  const [selectedValues, setSelectedValues] = React.useState(
    new Set<string>([])
  );

  const { refetch } = useQuery({
    queryKey: "tags",
    queryFn: fetchAllTags,
    onSuccess: (data) => {
      if (data.status === "success") {
        setTags(data.data);
      }
    },
    enabled: tags.length === 0,
  });

  useQuery({
    queryKey: "clip_tags",
    enabled: selectedValues.size === 0,
    queryFn: () => fetchClipTags(clipId),
    onSuccess: (data) => {
      if (data.status === "success") {
        setSelectedValues(new Set(data.data.map((item) => item.Name)));
      }
    },
  });

  const addTagMutation = useMutation<
    AddArticleTagResponse,
    unknown,
    AddArticleTagRequest
  >(fetchAddrticleTag, {
    onSuccess: (data) => {
      if (data.status === "success") {
        toast.success(`Tag ${data.data.Id} added!`);
      }
    },
    onError: () => {
      toast.error("Failed to add tag!");
    },
  });

  const createTagMutation = useMutation(fetchCreateTag, {
    onSuccess: (data) => {
      if (data.status === "success") {
        toast.success("New tag created!");
        handleAddArticleTag(data.data.Id);
        refetch();
      }
    },
  });

  const handleAddArticleTag = (tagId: string) => {
    addTagMutation.mutate({
      clip_id: clipId,
      tag_id: tagId,
    });
  };

  return (
    <div>
      <div className="pb-4 space-x-1">
        {Array.from(selectedValues.values()).map((value) => (
          <BadgeSelected
            key={value}
            value={value}
            tags={tags}
            refetch={refetch}
            setSelectedValues={setSelectedValues}
          />
        ))}
      </div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-8 border-dashed w-full"
          >
            <PlusCircledIcon className="mr-2 h-4 w-4" />
            {"Select tags"}
            {selectedValues.size > 0 && (
              <>
                <Separator orientation="vertical" className="mx-2 h-4" />
                <Badge
                  variant="secondary"
                  className="rounded-sm px-1 font-normal lg:hidden"
                >
                  {selectedValues.size}
                </Badge>
                <div className="hidden space-x-1 lg:flex">
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {selectedValues.size} selected
                  </Badge>
                </div>
              </>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" align="start" side="bottom">
          <CommanSearchTag
            tags={tags}
            setOpen={setOpen}
            selectedValues={selectedValues}
            setSelectedValues={setSelectedValues}
            mutate={createTagMutation.mutate}
            onAddArticleTag={handleAddArticleTag}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
