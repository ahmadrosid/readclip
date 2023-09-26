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
import { FilterIcon } from "lucide-react";
import { fetchAllArticles, Article } from "@/lib/api";
import app from "@/lib/firebase";
import { getAuth } from "firebase/auth";
import { useNavigate } from "@/router";
import { useAuthState } from "react-firebase-hooks/auth";

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-8">
      {Array(9)
        .fill(0)
        .map((_, i) => (
          <Card key={i}>
            <CardContent className="grid gap-4 py-4">
              <div className="flex gap-3">
                <Skeleton className="flex-1 h-[25px] rounded-sm" />
                <Skeleton className="w-[80px] h-[25px] rounded-sm" />
              </div>
              <Skeleton className="w-full h-[100px] rounded-md" />
              <Skeleton className="flex-1 h-[25px] rounded-sm" />
            </CardContent>
          </Card>
        ))}
    </div>
  );
}

export default function ArticlePage() {
  const navigate = useNavigate();
  const user = useAuthState(getAuth(app), {
    onUserChanged: async (user) => {
      if (!user) {
        navigate("/login");
      }
    },
  });

  const {
    data: articles,
    refetch,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: "articles",
    enabled: user !== null,
    queryFn: fetchAllArticles,
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

  return (
    <div className="p-4 md:p-8">
      <div className="px-1 flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Saved Clips</h2>
        <div>
          <Button variant="outline" size="icon">
            <FilterIcon className="w-4 h-4" />
          </Button>
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
              {articles?.pages.map((group, i) => (
                <Fragment key={i}>
                  {group.data.map((article) => (
                    <CommandItem
                      onSelect={() => {
                        window.location.href =
                          "/?url=" + encodeURIComponent(article.Url);
                      }}
                      key={article.Id}
                    >
                      {article.Title}
                    </CommandItem>
                  ))}
                </Fragment>
              ))}
            </CommandGroup>

            <CommandSeparator />
            <CommandGroup heading="Menu">
              <CommandItem onSelect={() => (window.location.href = "/")}>
                Home
              </CommandItem>
              <CommandItem>Saved</CommandItem>
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      </div>
      <div>
        <DialogTag
          article={tagArticle}
          open={openAddTag}
          onOpenChange={setOpenAddTag}
        />
      </div>
      {isFetching && !isFetchingNextPage && <LoadingSkeleton />}
      {isError && (
        <div className="grid place-content-center">
          <p className="text-2xl leading-tight">Could not load articles 😬</p>
          <div className="text-center py-2">
            <Button disabled={isLoading} onClick={() => refetch()}>
              Reload
            </Button>
          </div>
        </div>
      )}
      {articles ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-8">
            {articles.pages.map((group, i) => (
              <Fragment key={i}>
                {group.data.map((article) => (
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
          </div>
        </>
      ) : null}
    </div>
  );
}
