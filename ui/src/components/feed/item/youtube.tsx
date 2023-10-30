import { useMutation } from "react-query";
import { FindChannelResponse, findYoutubeChannels } from "@/lib/api/echotube";
import { useDebouncedCallback } from "use-debounce";
import { useState } from "react";
import { XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandLoading,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

export function FeedItemYoutube({
  onSubmit,
}: {
  onSubmit: (channelId: string) => void;
}) {
  const [selected, setSelected] = useState<FindChannelResponse | undefined>();
  const findChannelMutation = useMutation({
    mutationFn: findYoutubeChannels,
    mutationKey: "search-youtube-channels",
  });

  const debounced = useDebouncedCallback((value) => {
    if (value === "") {
      return;
    }
    findChannelMutation.mutate(value);
  }, 800);

  return (
    <>
      <div className="pt-4 relative">
        {selected ? (
          <div className="bg-white dark:bg-gray-700 border pl-2.5 pr-0.5 py-0.5 rounded-md flex">
            <div className="flex gap-3 items-center flex-1">
              <img
                src={selected.thumbnail}
                alt={selected.name}
                className="rounded-full h-5 w-5"
              />
              <p className="text-sm">{selected.name}</p>
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
            <Command className="dark:bg-gray-700">
              <CommandInput
                onChangeCapture={(e) => debounced(e.currentTarget.value)}
                placeholder="Search channels..."
              />
              <CommandList>
                {findChannelMutation.isLoading && (
                  <CommandLoading>
                    <div className="flex justify-between p-2 text-sm text-gray-700">
                      Loading...
                    </div>
                  </CommandLoading>
                )}
                <CommandGroup heading="Channels">
                  {findChannelMutation.data?.map((item) => (
                    <CommandItem
                      value={item.name}
                      onSelect={() => {
                        onSubmit(item.id);
                        setSelected(item);
                      }}
                      key={item.id}
                      className="flex gap-3 p-1.5 cursor-pointer"
                    >
                      <img
                        src={item.thumbnail}
                        alt={item.name}
                        className="rounded-full h-5 w-5"
                      />
                      <p>{item.name}</p>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </div>
        )}
      </div>
    </>
  );
}
