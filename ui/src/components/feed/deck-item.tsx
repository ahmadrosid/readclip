import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  BookmarkIcon,
  MoreVertical,
  RefreshCcwIcon,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "react-query";
import { fetchRssFeed } from "@/lib/api/feed";
import { toast } from "sonner";
import React, { useState } from "react";
import { MediaExtensions, type BaseDeck } from "@/components/feed/index";
import { cn } from "@/lib/utils";

type DeckComponentProps = BaseDeck & {
  id: string;
  onDeleteDeck: (id: string, title: string) => void;
};
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import HtmlTransformer from "@/lib/html-transformer";

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
    const { user } = useAuth();

    const [openPopover, setOpenPopover] = useState(false);
    const queryData = useQuery({
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      retry: 2,
      enabled: user !== undefined,
      queryFn: async () => {
        if (!user) return;
        const token = await user.getIdToken();
        return fetchRssFeed(
          {
            id,
            type: type,
            url: url,
            options: options,
          },
          token
        );
      },
      queryKey: [id, user],
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
      try {
        const url = new URL(link);
        return `https://logo.clearbit.com/${url.host}`;
      } catch (e) {
        return `https://readclip.site/favicon.ico`;
      }
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

      if (startIndex !== -1 && endIndex !== -1 && startIndex < endIndex) {
        const result = tokens.slice(startIndex + 1, endIndex).join("");
        return result;
      } else {
        return "";
      }
    };

    const getTextDescription = (ext: MediaExtensions): string => {
      try {
        const value = ext.media.group[0].children.description[0].value;
        if (value.length > 160) {
          return value.slice(0, 160) + "...";
        }
        return value;
      } catch (e) {
        return "";
      }
    };

    const getThumbnailUrl = (ext: MediaExtensions): string => {
      try {
        return ext.media.group[0].children.thumbnail[0].attrs.url;
      } catch (e) {
        return "";
      }
    };

    return (
      <div className="w-full max-w-md border-l border-b bg-white dark:bg-transparent flex-shrink-0 snap-center">
        <div className="p-2 border-b flex gap-2 items-center min-h-[40px]">
          {queryData.data?.data && (
            <img
              src={getLogoUrl(queryData.data?.data?.link)}
              alt={queryData.data?.data?.title}
              onError={(el) => {
                el.currentTarget.src = "https://readclip.site/favicon.ico";
              }}
              className="w-6 h-6"
            />
          )}
          <div className="flex-1 dark:text-gray-300">
            {queryData.data?.data?.title}
          </div>
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
                    onDeleteDeck(id, queryData.data?.data?.title || "");
                    setOpenPopover(false);
                  }}
                >
                  <Trash2 className="w-4 h-4 mr-3" /> Delete
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <div className="max-h-[85vh] scrollbar-thin overflow-y-auto">
          {queryData.isLoading && <LoadingSkeleton />}
          {queryData?.data?.data?.items.map((item) => (
            <div
              key={item.link}
              className="hover:bg-gray-100 dark:hover:bg-gray-800 border-b p-2"
            >
              {type === "youtube" ? (
                <>
                  <img
                    src={getThumbnailUrl(item.extensions)}
                    alt={item.title}
                    className="aspect-video object-cover rounded-md mb-2"
                  />
                  <div className="flex">
                    <a
                      target="_blank"
                      className="hover:underline flex-1"
                      href={item.link}
                    >
                      <h3 className="font-medium text-gray-800 dark:text-gray-300 tracking-tight text-base pb-1">
                        {item.title}
                      </h3>
                    </a>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="px-2 hover:bg-blue-300"
                      onClick={() =>
                        (window.location.href =
                          window.location.origin + "/clip?url=" + item.link)
                      }
                    >
                      <BookmarkIcon className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="text-sm text-gray-400">
                    {getTextDescription(item.extensions)}
                  </div>
                </>
              ) : (
                <>
                  <div className="flex">
                    <a
                      target="_blank"
                      className="hover:underline flex-1"
                      href={
                        type === "reddit" && item.link.startsWith("item?id=")
                          ? "https://news.ycombinator.com/" + item.link
                          : item.link
                      }
                    >
                      <h3 className="font-medium text-gray-800 dark:text-gray-300 tracking-tight text-base pb-1">
                        {item.title}
                      </h3>
                    </a>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="px-2 hover:bg-blue-300"
                      onClick={() =>
                        (window.location.href =
                          window.location.origin + "/clip?url=" + item.link)
                      }
                    >
                      <BookmarkIcon className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="prose-sm break-words prose-h1:text-base prose-h1:py-0 prose-p:text-sm prose-p:m-0 prose-pre:m-1 prose-img:my-2 prose-img:rounded-md prose-img:border max-w-md dark:text-gray-400">
                    {HtmlTransformer(
                      extractTextContent(item.description || item.content),
                      type
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }
);
