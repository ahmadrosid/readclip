import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
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
import { Check, PlusIcon, XIcon } from "lucide-react";
import { useQuery, useMutation } from "react-query";
import {
  AddArticleTagRequest,
  AddArticleTagResponse,
  Tag,
  fetchAddrticleTag,
  fetchAllTags,
  fetchCreateTag,
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
      <CommandInput
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleAddNewTag(e.currentTarget.value);
          }
        }}
        placeholder="Type to search or add new tag!"
      />

      <RenderEmptyState handleAddNewTag={handleAddNewTag} />

      <CommandGroup>
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
      </CommandGroup>
    </Command>
  );
}

export function SelecTag({ articleId }: { articleId: string }) {
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
      console.log({ data });
      if (data.status === "success") {
        toast.success("New tag created!");
        handleAddArticleTag(data.data.Id);
      }
      refetch();
    },
  });

  const handleDeletedSelectedBylabel = React.useCallback((label: string) => {
    setSelectedValues((prev) => {
      const next = new Set<string>(prev);
      next.delete(label);
      return next;
    });
  }, []);

  const handleAddArticleTag = (tagId: string) => {
    console.log("handleAddArticleTag here!", tagId);
    addTagMutation.mutate({
      article_id: articleId,
      tag_id: tagId,
    });
  };

  return (
    <div>
      <div className="pb-4 flex gap-1">
        {Array.from(selectedValues.values()).map((value) => (
          <Badge
            variant="secondary"
            key={value}
            onClick={() => handleDeletedSelectedBylabel(value)}
            className="rounded-sm font-normal cursor-pointer"
          >
            {value}
            <XIcon className="ml-1 h-3 w-3" />
          </Badge>
        ))}
      </div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 border-dashed">
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
        <PopoverContent className="p-0" align="start">
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
