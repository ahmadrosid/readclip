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
import { Skeleton } from "@/components/ui/skeleton";

export function LoadingSkeleton() {
  return (
    <>
      {Array(10)
        .fill(0)
        .map((_, idx) => (
          <div
            key={idx}
            className="flex items-center space-x-2 w-full p-2 border-b"
          >
            <Skeleton className="h-11 w-11 rounded-md" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[22rem]" />
              <Skeleton className="h-4 w-[23rem]" />
            </div>
          </div>
        ))}
    </>
  );
}

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

    const extractTextContent = (content: string): string => {
      if (type === "reddit") {
        return extractRedditContent(content);
      }

      return content;
    };

    const extractRedditContent = (content: string) => {
      const tokens = content.split(/(<!--\s*SC_OFF\s*-->|<!--\s*SC_ON\s*-->)/);
      const startIndex = tokens.indexOf("<!-- SC_OFF -->");
      const endIndex = tokens.indexOf("<!-- SC_ON -->");

      console.log(content);

      if (startIndex !== -1 && endIndex !== -1 && startIndex < endIndex) {
        const result = tokens.slice(startIndex + 1, endIndex).join("");
        console.log(result);
        return result;
      } else {
        return "";
      }
    };

    return (
      <div className="w-full max-w-md border-l border-b bg-white flex-shrink-0 snap-center">
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
          {queryData.isLoading && <LoadingSkeleton />}
          {queryData?.data?.data?.items.map((item) => (
            <div key={item.link} className="hover:bg-gray-100 border-b p-2">
              <a target="_blank" className="hover:underline" href={item.link}>
                <h3 className="font-medium text-gray-800 tracking-tight text-base pb-1">
                  {item.title}
                </h3>
              </a>
              <div
                className="prose-sm break-words prose-h1:text-base prose-h1:py-0 prose-p:text-sm prose-p:m-0 prose-pre:m-1 prose-img:my-2 prose-img:rounded-md max-w-md"
                dangerouslySetInnerHTML={{
                  __html: extractTextContent(item.description || item.content),
                }}
              ></div>
            </div>
          ))}
        </div>
      </div>
    );
  }
);
