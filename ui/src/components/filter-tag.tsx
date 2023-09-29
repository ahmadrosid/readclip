import * as React from "react";
import { FilterIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
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

type Props = {
  onSelect: (tag?: Tag) => void;
};

export function FilterTag({ onSelect }: Props) {
  const [open, setOpen] = React.useState(false);
  const { data } = useQuery({
    queryKey: "tags",
    queryFn: fetchAllTags,
  });

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open}>
          <FilterIcon className="w-4 h-4" />
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
                }}
              >
                {tag.Name}
              </CommandItem>
            ))}
            <CommandSeparator className="my-1" />
            <CommandItem
              onSelect={() => {
                onSelect();
                setOpen(false);
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
