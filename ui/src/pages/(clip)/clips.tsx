import { Fragment, useCallback, useEffect, useState } from "react";
import { ArticleCard } from "@/components/article-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { CommandSeparator } from "cmdk";
import { useInfiniteQuery } from "react-query";
import { DialogTag } from "@/components/dialog-tag";
import { Button } from "@/components/ui/button";
import { fetchAllArticles, Article } from "@/lib/api/api";
import { FilterTag } from "@/components/filter-tag";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function ArticlePage() {
  const { user, navigate } = useAuth();
  const [tagId, setTagId] = useState("");
  const [selectedHost, setSelectedHost] = useState("");

  const {
    data: clips,
    refetch,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["clips", tagId],
    enabled: user !== null,
    queryFn: (param) => {
      return fetchAllArticles({
        pageParam: param.pageParam || 1,
        tagId: tagId,
      });
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const [openCommandDialog, setOpenCommandDialog] = useState(false);
  const [openAddTag, setOpenAddTag] = useState(false);
  const [tagArticle, setTagArticle] = useState<Article>();

  const handleOndeleteCallback = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleOnAddTagCallback = useCallback((article: Article) => {
    setOpenAddTag(true);
    setTagArticle(article);
  }, []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpenCommandDialog((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const firstPageData = clips?.pages?.[0]?.data;
  const hasData = Boolean(firstPageData && firstPageData.length);
  const hosts = new Set<string>(
    clips?.pages
      ?.map((page) => page.data.map((article) => article.Hostname))
      .flat()
  );

  return (
    <div className="p-4 md:p-8 min-h-[80vh]">
      <div className="px-1 grid sm:flex gap-4 justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Saved Clips</h2>
        <div className="flex gap-2">
          <Input
            className="bg-white dark:bg-gray-800 flex-1 w-full sm:w-64"
            placeholder="Search clips..."
            onClick={(e) => {
              e.preventDefault();
              if (!openCommandDialog) {
                setOpenCommandDialog(true);
              }
            }}
          />
          <FilterTag
            onSelect={(tag) => {
              if (tag) {
                setTagId(tag.Id);
              } else {
                setTagId("");
              }
            }}
          />
        </div>
      </div>
      <div>
        <CommandDialog
          open={openCommandDialog}
          onOpenChange={setOpenCommandDialog}
        >
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Suggestions">
              {clips?.pages.map((group, i) => (
                <Fragment key={i}>
                  {group.data.map((clip) => (
                    <CommandItem
                      onSelect={() => {
                        window.location.href = `/clip?url=${clip.Url}`;
                      }}
                      key={clip.Id}
                    >
                      {clip.Title}
                    </CommandItem>
                  ))}
                </Fragment>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Menu">
              <CommandItem onSelect={() => navigate("/")}>Home</CommandItem>
              <CommandItem onSelect={() => navigate("/clips")}>
                Saved
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      </div>
      <div>
        <DialogTag
          clip={tagArticle}
          open={openAddTag}
          onOpenChange={setOpenAddTag}
        />
      </div>
      {isFetching && !isFetchingNextPage && <LoadingSkeleton />}
      {isError && (
        <div className="grid place-content-center">
          <p className="text-2xl leading-tight">Could not load clips 😬</p>
          <div className="text-center py-2">
            <Button disabled={isLoading} onClick={() => refetch()}>
              Reload
            </Button>
          </div>
        </div>
      )}
      {clips ? (
        <>
          <div className="flex gap-2 pt-4 pb-4 sm:pb-2 max-w-screen-2xl overflow-x-auto">
            {Array.from(hosts.values()).map((host, i) => (
              <Badge
                onClick={() => {
                  if (selectedHost === host) {
                    setSelectedHost("");
                  } else {
                    setSelectedHost(host);
                  }
                }}
                variant="outline"
                className={cn(
                  "hover:bg-gray-200 cursor-pointer bg-white",
                  selectedHost === host &&
                    "bg-primary text-white hover:text-gray-700"
                )}
                key={i}
              >
                {host}
              </Badge>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 py-8">
            {clips.pages.map((group, i) => (
              <Fragment key={i}>
                {group.data
                  .filter((item) => {
                    if (selectedHost === "") {
                      return true;
                    }

                    return selectedHost === item.Hostname;
                  })
                  .map((article) => (
                    <ArticleCard
                      key={article.Id}
                      article={article}
                      current_datetime={group.current_datetime}
                      onDeleteCallback={handleOndeleteCallback}
                      onAddTagCallback={handleOnAddTagCallback}
                    />
                  ))}
              </Fragment>
            ))}
          </div>
          <div className="flex justify-center w-full">
            {hasData && (
              <Button
                disabled={!hasNextPage || isFetchingNextPage}
                onClick={() => fetchNextPage()}
                size="lg"
              >
                {isFetchingNextPage
                  ? "Loading more..."
                  : hasNextPage
                  ? "Load More"
                  : "Nothing more to load"}{" "}
              </Button>
            )}
          </div>
        </>
      ) : null}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 py-8">
      {Array(12)
        .fill(0)
        .map((_, i) => (
          <Card key={i} className="shadow-none">
            <CardContent className="grid gap-4 p-4">
              <div className="flex gap-3">
                <Skeleton className="flex-1 h-[20px] rounded-sm" />
                <Skeleton className="w-[80px] h-[20px] rounded-sm" />
              </div>
              <Skeleton className="w-full h-[100px] rounded-md" />
              <Skeleton className="flex-1 h-[20px] rounded-sm" />
            </CardContent>
          </Card>
        ))}
    </div>
  );
}
