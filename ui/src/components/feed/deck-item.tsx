import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { MoreVertical, RefreshCcwIcon, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "react-query";
import { fetchRssFeed } from "@/lib/api/feed";
import { toast } from "sonner";
import React, { useState } from "react";
import { type BaseDeck } from "@/components/feed/index";
import { cn } from "@/lib/utils";

type DeckComponentProps = BaseDeck & {
  id: string;
  onDeleteDeck: (id: string) => void;
};

export const DeckItem = React.memo<DeckComponentProps>(
  ({ type, url, options, id, onDeleteDeck }) => {
    const [openPopover, setOpenPopover] = useState(false);
    const queryData = useQuery({
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      queryFn: () =>
        fetchRssFeed({
          type: type,
          url: url,
          options: options,
        }),
      queryKey: id,
      onSuccess: () => {
        if (openPopover) {
          setOpenPopover(false);
        }
      },
      onError: (err: Error) => {
        toast.error(err.message);
      },
    });

    const getLogoUrl = (link: string) => {
      const url = new URL(link);
      return `https://logo.clearbit.com/${url.host}`;
    };

    return (
      <div className="w-full max-w-md border-l border-b bg-white flex-shrink-0">
        <div className="p-2 border-b flex gap-2 items-center min-h-[40px]">
          {queryData.data?.data && (
            <img
              src={getLogoUrl(queryData.data?.data?.link)}
              alt={queryData.data?.data?.title}
              className="w-6 h-6"
            />
          )}
          <div className="flex-1">{queryData.data?.data?.title}</div>
          <Popover open={openPopover} onOpenChange={setOpenPopover}>
            <PopoverTrigger>
              <MoreVertical className="w-4 h-4" />
            </PopoverTrigger>
            <PopoverContent side="bottom" align="start" className="p-1.5 w-52">
              <div className="grid gap-1">
                <Button
                  variant="ghost"
                  className="justify-start"
                  type="submit"
                  size="sm"
                  onClick={() => queryData.refetch()}
                >
                  <RefreshCcwIcon
                    className={cn(
                      "w-4 h-4 mr-3",
                      queryData.isRefetching && "animate-spin"
                    )}
                  />{" "}
                  Refresh
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="justify-start"
                  onClick={() => {
                    onDeleteDeck(id);
                    setOpenPopover(false);
                  }}
                >
                  <Trash2 className="w-4 h-4 mr-3" /> Delete
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <div className="grid max-h-[85vh] overflow-y-auto">
          {queryData?.data?.data?.items.map((item) => (
            <div key={item.link} className="hover:bg-gray-100 border-b p-2">
              <a target="_blank" href={item.link}>
                <h3 className="font-bold text-gray-800 tracking-tight text-base pb-1">
                  {item.title}
                </h3>
                <div
                  className="text-gray-700 text-sm space-y-1"
                  dangerouslySetInnerHTML={{ __html: item.description }}
                ></div>
              </a>
            </div>
          ))}
        </div>
      </div>
    );
  }
);
