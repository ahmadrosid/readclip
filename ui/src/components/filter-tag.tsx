import * as React from "react";
import { CheckIcon, FilterIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { fetchAllTags, type Tag } from "@/lib/api";
import { useQuery } from "react-query";
import { Separator } from "./ui/separator";
import { cn } from "@/lib/utils";

type Props = {
  onSelect: (tag?: Tag) => void;
};

export function FilterTag({ onSelect }: Props) {
  const [selectedValues, setSelectedValues] = React.useState(new Set<Tag>());
  const [open, setOpen] = React.useState(false);
  const { data } = useQuery({
    queryKey: "tags",
    queryFn: fetchAllTags,
  });

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8">
          {selectedValues?.size > 0 && (
            <>
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {selectedValues.size}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {selectedValues.size > 2 ? (
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {selectedValues.size} selected
                  </Badge>
                ) : (
                  data?.data
                    .filter((option) => selectedValues.has(option))
                    .map((option) => (
                      <Badge
                        variant="secondary"
                        key={option.Id}
                        className="rounded-sm px-1 font-normal"
                      >
                        {option.Name}
                      </Badge>
                    ))
                )}
              </div>
              <Separator orientation="vertical" className="mx-2 h-4" />
            </>
          )}
          <FilterIcon
            className={cn(selectedValues?.size > 0 && "ml-2", "h-4 w-4")}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="end">
        <Command>
          <CommandInput placeholder="Search tag..." />
          <CommandEmpty>No tag found.</CommandEmpty>
          <CommandGroup>
            {data?.data.map((tag) => (
              <CommandItem
                key={tag.Id}
                onSelect={() => {
                  onSelect(tag);
                  setOpen(false);
                  if (!selectedValues.has(tag)) {
                    setSelectedValues(() => {
                      const next = new Set<Tag>();
                      next.add(tag);
                      return next;
                    });
                  }
                }}
              >
                <div
                  className={cn(
                    "mr-2 flex h-4 w-4 p-0.5",
                    selectedValues.has(tag)
                      ? "text-black dark:text-white"
                      : "opacity-0 [&_svg]:invisible"
                  )}
                >
                  <CheckIcon className="h-4 w-4" />
                </div>
                <span>{tag.Name}</span>
              </CommandItem>
            ))}
            <CommandSeparator className="my-1" />
            <CommandItem
              onSelect={() => {
                onSelect();
                setOpen(false);
                setSelectedValues(new Set());
              }}
            >
              Clear selection
            </CommandItem>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
