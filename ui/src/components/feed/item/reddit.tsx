import { useState } from "react";
import { XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { subReddits } from "@/lib/data/reddit";
import { formatNumber } from "@/lib/utils";

type RedditItem = {
  name: string;
  title: string;
  icon: null | string;
  count_users: number;
};

export function FeedItemReddit({
  onSubmit,
}: {
  onSubmit: (channelId: string) => void;
}) {
  const [selected, setSelected] = useState<RedditItem | undefined>();

  return (
    <>
      <div className="pt-4 relative">
        {selected ? (
          <div className="bg-white border pl-1.5 pr-0.5 py-0.5 rounded-md flex">
            <div className="flex gap-3 items-center flex-1">
              <img
                src={selected.icon || "https://logo.clearbit.com/reddit.com"}
                alt={selected.name}
                className="rounded-full h-5 w-5"
              />
              <p className="text-sm">{selected.name}</p>
              <p className="text-xs">
                Member:{formatNumber(selected.count_users)}
              </p>
            </div>
            <Button
              variant={"ghost"}
              size="sm"
              className="px-2"
              onClick={() => setSelected(undefined)}
            >
              <XIcon className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <div className="rounded-md overflow-hidden border">
            <Command>
              <CommandInput placeholder="Search sub-reddit..." />
              <CommandList>
                {subReddits.map((item) => (
                  <CommandGroup key={item.group} heading={item.group}>
                    {item.items.map((room) => (
                      <CommandItem
                        value={room.name}
                        onSelect={() => {
                          onSubmit(room.name);
                          setSelected(room);
                        }}
                        key={room.name}
                        className="flex gap-3 p-1.5 hover:bg-gray-50 cursor-pointer"
                      >
                        <img
                          src={
                            room.icon || "https://logo.clearbit.com/reddit.com"
                          }
                          alt={room.name}
                          className="rounded-full h-5 w-5"
                        />
                        <p>{room.name}</p>
                        <p className="text-xs text-gray-500">
                          Member:{formatNumber(room.count_users)}
                        </p>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                ))}
              </CommandList>
            </Command>
          </div>
        )}
      </div>
    </>
  );
}
