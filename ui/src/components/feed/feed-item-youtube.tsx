import { useMutation } from "react-query";
import { Input } from "@/components/ui/input";
import { FindChannelResponse, findYoutubeChannels } from "@/lib/api/echotube";
import { useDebouncedCallback } from "use-debounce";
import { useState } from "react";
import { XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FeedItemYoutube({
  onSubmit,
}: {
  onSubmit: (channelId: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<FindChannelResponse | undefined>();
  const findChannelMutation = useMutation({
    mutationFn: findYoutubeChannels,
    mutationKey: "search-youtube-channels",
    onSuccess(data) {
      if (data.length > 0) {
        setOpen(true);
      }
    },
  });

  const debounced = useDebouncedCallback((value) => {
    if (value === "") {
      setOpen(false);
      return;
    }
    findChannelMutation.mutate(value);
  }, 800);

  return (
    <>
      <div className="pt-4 relative">
        {selected ? (
          <div className="bg-white border pl-1.5 pr-0.5 py-0.5 rounded-md flex">
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
          <label>
            <span className="text-sm pb-2 block text-gray-600">
              Search youtube channels
            </span>
            <Input
              name="input_find_channels"
              className="bg-white"
              placeholder="MrBeast"
              onChange={(e) => {
                debounced(e.currentTarget.value);
              }}
            />
          </label>
        )}
        {open && (
          <div className="pt-1">
            <ul className="bg-white border rounded-md overflow-hidden">
              {findChannelMutation.data?.map((item) => (
                <li
                  onClick={() => {
                    onSubmit(item.id);
                    setSelected(item);
                    setOpen(false);
                  }}
                  key={item.id}
                  className="flex gap-3 p-1.5 hover:bg-gray-50 cursor-pointer"
                >
                  <img
                    src={item.thumbnail}
                    alt={item.name}
                    className="rounded-full h-5 w-5"
                  />
                  <p>{item.name}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}
