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
import React from "react";
import { type BaseDeck } from "@/components/feed/index";

type DeckComponentProps = BaseDeck & {
  id: string;
  onDeleteDeck: (id: string) => void;
};

export const DeckItem = React.memo<DeckComponentProps>(
  ({ type, url, options, id, onDeleteDeck }) => {
    const queryData = useQuery({
      queryFn: () =>
        fetchRssFeed({
          type: type,
          url: url,
          options: options,
        }),
      queryKey: id,
      onError: (err: Error) => {
        toast.error(err.message);
      },
    });

    const getLogoUrl = (link: string) => {
      const url = new URL(link);
      return `https://logo.clearbit.com/${url.host}`;
    };

    return (
      <div className="w-full max-w-md border-r border-b bg-white flex-shrink-0">
        <div className="p-2 border-b flex gap-2 items-center">
          {queryData.data?.data && (
            <img
              src={getLogoUrl(queryData.data?.data?.link)}
              alt={queryData.data?.data?.title}
              className="w-6 h-6"
            />
          )}
          <div className="flex-1">{queryData.data?.data?.title}</div>
          <Popover>
            <PopoverTrigger>
              <MoreVertical />
            </PopoverTrigger>
            <PopoverContent side="left" align="start" className="p-2 w-52">
              <div className="grid gap-2">
                <Button
                  variant="ghost"
                  className="justify-start"
                  type="submit"
                  onClick={() => queryData.refetch()}
                >
                  <RefreshCcwIcon className="w-4 h-4 mr-3" /> Refresh
                </Button>
                <Button
                  variant="ghost"
                  className="justify-start"
                  onClick={() => onDeleteDeck(id)}
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
              <h3 className="font-bold text-gray-800 tracking-tight text-base pb-1">
                {item.title}
              </h3>
              <div
                className="text-gray-700 text-sm space-y-1"
                dangerouslySetInnerHTML={{ __html: item.description }}
              ></div>
            </div>
          ))}
        </div>
      </div>
    );
  }
);
