import { Fragment, useCallback, useEffect, useState } from "react";
import { ArticleCard } from "@/components/article-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandDialog,
  CommandList,
} from "@/components/ui/command";
import { useInfiniteQuery, useQuery, useMutation } from "react-query";
import { DialogTag } from "@/components/dialog-tag";
import { Button } from "@/components/ui/button";
import { fetchAllArticles, fetchSearchClips, Article, fetchAllTags } from "@/lib/api/api";
import { FilterTag } from "@/components/filter-tag";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Search as SearchIcon, Loader2 as LoaderIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function ArticlePage() {
  const { user, navigate } = useAuth();
  const [tagId, setTagId] = useState("");
  const [selectedHost, setSelectedHost] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Article[]>([]);
  const [openTagPopover, setOpenTagPopover] = useState(false);
  const [tagSearchQuery, setTagSearchQuery] = useState("");
  const [openCommandDialog, setOpenCommandDialog] = useState(false);
  const [openAddTag, setOpenAddTag] = useState(false);
  const [tagArticle, setTagArticle] = useState<Article>();
  const [visibleTagId, setVisibleTagId] = useState("");

  const searchMutation = useMutation({
    mutationFn: async (query: string) => {
      if (!user) throw new Error("Unauthorized");
      const token = await user.getIdToken();
      return fetchSearchClips({
        query,
        token,
      });
    },
    onSuccess: (response) => {
      setSearchResults(response.data);
    },
  });

  const handleSearch = useCallback((value: string) => {
    setSearchQuery(value);
    if (value.trim()) {
      searchMutation.mutate(value);
    } else {
      setSearchResults([]);
    }
  }, [searchMutation]);

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
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    queryKey: ["clips", tagId],
    enabled: user !== null,
    queryFn: async (param) => {
      const token = await user?.getIdToken();
      return fetchAllArticles({
        pageParam: param.pageParam || 1,
        tagId: tagId,
        token: token || "",
      });
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const tagsQuery = useQuery({
    queryKey: "tags",
    queryFn: fetchAllTags,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: 2,
  });

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

  const maxBadgeTags = 7;

  return (
    <div className="p-4 md:p-8 min-h-[80vh]">
      <div className="px-1 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight flex-1">Saved Clips</h2>
        <div className="flex gap-2 py-2 sm:py-0">
          <Button
            variant="outline"
            className="bg-white dark:bg-gray-800"
            onClick={(e) => {
              e.preventDefault();
              if (!openCommandDialog) {
                setOpenCommandDialog(true);
              }
            }}
          >
            {searchMutation.isLoading ? (
              <LoaderIcon className="size-4 animate-spin" />
            ) : (
              <SearchIcon className="size-4" />
            )}
          </Button>
          <FilterTag
            data={Array.from(hosts.values())}
            onSelect={(host) => {
              setSelectedHost(host);
            }}
          />
        </div>
      </div>
      <div>
        <CommandDialog 
          open={openCommandDialog} 
          onOpenChange={setOpenCommandDialog}
        >
          <CommandInput 
            placeholder="Type to search..." 
            value={searchQuery}
            onValueChange={handleSearch}
          />
          <CommandList>
            {searchMutation.isLoading ? (
              <div className="flex items-center justify-center py-6">
                <LoaderIcon className="size-6 animate-spin" />
              </div>
            ) : (
              <CommandGroup heading="Search Results">
                {searchResults.map((clip) => (
                  <CommandItem
                    onSelect={() => {
                      window.location.href = `/clip?url=${clip.Url}`;
                    }}
                    key={clip.Id}
                  >
                    {clip.Title}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
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
      <div className="flex flex-wrap justify-center gap-2 pt-4 sm:pb-2 overflow-x-auto scrollbar-thin">
        {tagsQuery.data?.data
          .filter((tag) => tagsQuery.data.data.indexOf(tag) < maxBadgeTags)
          .map((item) => (
            <Badge
              className={cn(
                "text-gray-600 hover:bg-gray-200 cursor-pointer bg-white dark:bg-gray-800 hover:text-gray-600 dark:text-gray-300",
                tagId === item.Id &&
                  "bg-primary text-white hover:text-gray-600 dark:bg-gray-700"
              )}
              key={item.Id}
              onClick={() => {
                if (tagId === item.Id) {
                  setTagId("");
                } else {
                  setTagId(item.Id);
                }
              }}
            >
              {item.Name}
            </Badge>
          ))}
        {visibleTagId && tagsQuery.data?.data.find(tag => tag.Id === visibleTagId && tagsQuery.data.data.indexOf(tag) >= 7) && (
          <Badge
            className={cn(
              "text-gray-600 hover:bg-gray-200 cursor-pointer bg-white dark:bg-gray-800 hover:text-gray-600 dark:text-gray-300",
              tagId === visibleTagId &&
                "bg-primary text-white hover:text-gray-600 dark:bg-gray-700"
            )}
            onClick={() => {
              if (tagId === visibleTagId) {
                setTagId("");
                setVisibleTagId("");
              } else {
                setTagId(visibleTagId);
              }
            }}
          >
            {tagsQuery.data.data.find(tag => tag.Id === visibleTagId)?.Name}
          </Badge>
        )}
        {tagsQuery.data?.data && tagsQuery.data.data.length > maxBadgeTags && (
          <Popover open={openTagPopover} onOpenChange={setOpenTagPopover}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-sm font-normal"
              >
                +{tagsQuery.data.data.length - 7} more
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0" align="end">
              <Command>
                <CommandInput 
                  placeholder="Search tags..." 
                  value={tagSearchQuery}
                  onValueChange={setTagSearchQuery}
                />
                <CommandEmpty>No tags found.</CommandEmpty>
                <CommandGroup className="max-h-[400px] overflow-y-auto scrollbar-thin">
                  {tagsQuery.data.data
                    .filter((tag) => 
                      tagsQuery.data.data.indexOf(tag) >= 7 &&
                      tag.Name.toLowerCase().includes(tagSearchQuery.toLowerCase())
                    )
                    .map((item) => (
                      <CommandItem
                        key={item.Id}
                        onSelect={() => {
                          if (tagId === item.Id) {
                            setTagId("");
                            setVisibleTagId("");
                          } else {
                            setTagId(item.Id);
                            setVisibleTagId(item.Id);
                          }
                          setOpenTagPopover(false);
                        }}
                      >
                        <Badge
                          className={cn(
                            "text-gray-600 bg-white dark:bg-gray-800 dark:text-gray-300",
                            tagId === item.Id &&
                              "bg-primary text-white dark:bg-gray-700"
                          )}
                        >
                          {item.Name}
                        </Badge>
                      </CommandItem>
                    ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        )}
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
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 py-8">
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
      {Array(8)
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
