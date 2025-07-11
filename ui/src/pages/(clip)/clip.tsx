import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCallback, useEffect, useState } from "react";
import { Markdown } from "@/components/markdown";
import {
  Circle,
  CopyIcon,
  DownloadIcon,
  ExternalLink,
  ExternalLinkIcon,
  Loader2,
  MoreHorizontal,
  PencilIcon,
  RefreshCw,
  Send,
  TagIcon,
  TrashIcon,
} from "lucide-react";
import {
  fetchMarkdown,
  fetchDeleteClip,
  fetchAllArticles,
} from "@/lib/api/api";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { downloadText } from "@/lib/utils";
import { readingTime } from "reading-time-estimator";
import { useMutation, useQuery } from "react-query";
import { toast } from "sonner";
import { DialogTag } from "@/components/dialog-tag";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";
import { DialogDemo } from "..";
import { Link } from "@/router";
import { SummaryCard } from "@/components/summary-card";
import { SummaryButton } from "@/components/summary-button";
import CreateNewClip from "@/components/create-new-clip";
import { DialogEditClip } from "@/components/dialog-edit-clip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

function LoadingSkeleton() {
  return (
    <div className="py-4 flex justify-center">
      <div className="bg-white dark:bg-secondary py-4 rounded-md w-full max-w-3xl px-4 border space-y-4">
        <Skeleton className="w-[100px] h-[20px] rounded-sm" />
        <Skeleton className="w-full h-[40px] rounded-md" />
        <Skeleton className="w-full h-[400px] rounded-md" />
      </div>
    </div>
  );
}

export default function Home() {
  const { navigate, user } = useAuth();
  const params = new URLSearchParams(window.location.search);
  const urlParam = params.get("url");
  const [inputUrl, setInputUrl] = useState(urlParam ?? "");
  const [openAddTag, setOpenAddTag] = useState(false);
  const [openEditClip, setOpenEditClip] = useState(false);
  const [failedErrorMessage, setFailedError] = useState<string>("Failed to fetch article. Please check your url.");

  const fetchHistoryQuery = useQuery({
    queryFn: async () => {
      const token = await user?.getIdToken();
      return fetchAllArticles({
        token: token || "",
      });
    },
    queryKey: "fetch-history",
    enabled: inputUrl == "",
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    onError: (error: Error) => {
      toast.error("Failed to fetch history " + error.message);
    },
  });

  const { data, mutate, isLoading, error } = useMutation({
    mutationFn: fetchMarkdown,
    mutationKey: ["clip", inputUrl],
    retry: 2,
    onError: (err: Error) => {
      if (err.message === "Unauthorized") {
        toast.error("Unauthorized! Please login to continue");
        return;
      }
      toast.error(err.message);
    },
  });

  const deleteMutation = useMutation({
    mutationKey: "deleteClip",
    mutationFn: fetchDeleteClip,
    onSuccess(data) {
      if (data.status === "success") {
        navigate("/clips");
        toast.success("Clip deleted!");
      } else {
        toast.error("Failed to delete article");
      }
    },
    onError: (err) => {
      if (err instanceof Error) {
        toast.error(err.message);
      }
    },
  });

  const readingEst = readingTime(data?.data?.Content || "", 260);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (inputUrl === "https://readclip.site/clips") {
        toast.error("You can't save this url into a clip!");
        return;
      }
      if (inputUrl !== "") {
        const url = new URL(window.location.href);
        url.searchParams.set("url", inputUrl);
        window.history.replaceState({}, "", url);
        mutate(inputUrl);
      }
    },
    [inputUrl, mutate]
  );

  const handleCopyClip = useCallback(() => {
    navigator.clipboard
      .writeText(`# ${data?.data?.Title}\n\n${data?.data?.Content}`)
      .then(() => {
        toast.success("Copied to clipboard!");
      });
  }, [data]);

  const handleDownloadClip = useCallback(() => {
    if (data) {
      const title = `${data.data.Title}.md`;
      downloadText(title, `# ${data.data.Title}\n\n${data.data.Content}`);
      toast.success(`Downloaded "${title}"!`);
    }
  }, [data]);

  const handleDeleteClip = useCallback(async () => {
    if (data?.data.Id && user) {
      const token = await user.getIdToken();
      deleteMutation.mutate({ id: data.data.Id, token });
    }
  }, [data, deleteMutation, user]);

  const handleAddTag = useCallback(() => setOpenAddTag(true), []);
  const setResult = (result: string) => {
    setInputUrl(result)
    mutate(result);
  };

  useEffect(() => {
    if (urlParam !== null && !isLoading && !data && !deleteMutation.isLoading) {
      if (urlParam === "https://readclip.site/clips") {
        setTimeout(() => {
          toast.error("You can't save this url into a clip!");
        })
        return;
      }
      if (error) {
        setFailedError(error.message);
        return;
      }
      mutate(urlParam);
    }
  }, [urlParam, isLoading, error, data, mutate, deleteMutation.isLoading, failedErrorMessage]);

  return (
    <div className="px-4 gap-4 min-h-[80vh] relative">
      <div className="py-4 w-full dark:backdrop-blur">
        <div className="max-w-3xl mx-auto">
          <form
            onSubmit={handleSubmit}
            className="w-full flex items-center py-2 gap-4"
          >
            <div className="space-y-2 flex-1">
              <Input
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                type="text"
                placeholder="https://..."
                name="web_url"
                className="bg-white h-12 dark:bg-gray-700"
              />
            </div>
            <div className="py-2 space-x-2">
              <Button className="h-12 dark:bg-gray-700 dark:hover:bg-gray-800 text-white">
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
              <CreateNewClip setResult={setResult} />
            </div>
          </form>
        </div>
      </div>

      <SummaryCard summaryContent={data?.data.Summary || ""} />

      {!isLoading && error !== null && inputUrl !== "" && (
        <div className="py-4 flex justify-center">
          <div className="bg-white dark:bg-secondary py-4 rounded-md w-full max-w-3xl px-4 border space-y-4">
            <p className="text-center text-rose-500 dark:text-rose-500/75">
              {failedErrorMessage}
            </p>
          </div>
        </div>
      )}

      {isLoading && inputUrl !== "" && <LoadingSkeleton />}

      {inputUrl === "" && (
        <div className="mx-auto min-w-xs max-w-md sm:max-w-3xl mb-8 bg-white dark:bg-gray-800/40 rounded-md overflow-hidden">
          <div className="py-2 px-3 border w-full rounded-t-md dark:text-gray-400">
            <span className="pr-3">📖</span>History
          </div>
          <div className="p-2 border-x border-b  rounded-b-md">
            {fetchHistoryQuery.data?.data.length === 0 && (
              <div className="p-2 flex gap-2">
                <p>Your history is empty. Don't know how to use? </p>
                <DialogDemo className="text-base p-0" />
              </div>
            )}
            {fetchHistoryQuery.isLoading && (
              <div className="grid gap-2 p-2">
                <div className="flex gap-2">
                  <Skeleton className="w-32 h-8 rounded-md" />
                  <Skeleton className="w-full h-8 rounded-md" />
                </div>
                <Skeleton className="w-full h-8 rounded-md" />
              </div>
            )}
            <table className="table-auto">
              <tbody>
                {fetchHistoryQuery.data?.data.slice(0, 15).map((item) => (
                  <tr key={item.Id}>
                    <td className="hidden sm:flex justify-end h-9 items-center w-[110px]">
                      <p className="text-gray-500 text-sm pt-2">
                        {format(new Date(item.CreatedAt), "EEE dd, HH:mm")}
                      </p>
                    </td>
                    <td className="pl-2">
                      <p className="py-1 dark:text-gray-300">
                        <span
                          className="h-9 cursor-pointer underline sm:no-underline hover:underline font-medium tracking-tight"
                          onClick={() => {
                            setInputUrl(item.Url);
                            const url = new URL(window.location.href);
                            url.searchParams.set("url", item.Url);
                            window.history.replaceState({}, "", url);
                            mutate(item.Url);
                          }}
                        >
                          {item.Title}
                        </span>
                        <a
                          href={item.Url}
                          target="_blank"
                          className="text-sm text-gray-500 hover:underline mx-1 inline-flex items-center"
                        >
                          {"("}
                          {item.Hostname.replace("www.", "")}
                          <ExternalLinkIcon className="ml-1 h-3 w-3" />
                          {")"}
                        </a>
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {fetchHistoryQuery.data &&
              fetchHistoryQuery.data.data.length > 0 && (
                <div className="p-2 flex gap-2 tracking-tight text-primary">
                  <Link to="/clips" className="hover:underline">
                    See all history
                  </Link>
                </div>
              )}
          </div>
        </div>
      )}

      {data?.data && (
        <>
          <DialogTag
            clip={data.data}
            open={openAddTag}
            onOpenChange={setOpenAddTag}
          />
          <div className="pb-4">
            <div className="bg-white dark:bg-gray-800/40 py-4 rounded-md w-full min-w-xs max-w-md sm:max-w-3xl border block mx-auto">
              {data.data && (
                <div className="px-4 flex items-center flex-col-reverse sm:flex-row gap-4">
                  <div className="flex flex-1 gap-2">
                    <a
                      href={data.data.Url}
                      target="_blank"
                      className="text-sm text-gray-500 hover:underline hover:text-gray-700 inline-flex items-center gap-1"
                    >
                      <ExternalLink className="h-3 w-3" />
                      Visit link
                    </a>
                    <p className="text-sm text-gray-500 inline-flex gap-1 items-center">
                      <Circle className="w-2 h-2 fill-gray-500" />
                      {readingEst.text + ", " + readingEst.words} words
                    </p>
                  </div>
                  <div className="mx-auto">
                    <div className="flex items-center rounded-md bg-secondary text-secondary-foreground border">
                      <Button
                        variant="secondary"
                        onClick={handleAddTag}
                        className="px-3 shadow-none hover:bg-gray-300/50 hover:text-gray-600 h-8"
                      >
                        <TagIcon className="h-3 w-3" />
                      </Button>
                      <Separator orientation="vertical" className="h-[20px]" />
                      <Button
                        variant="secondary"
                        onClick={handleDeleteClip}
                        className="px-3 shadow-none hover:bg-gray-300/50 hover:text-gray-600 h-8"
                      >
                        {deleteMutation.isLoading ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <TrashIcon className="h-3 w-3" />
                        )}
                      </Button>
                      <Separator orientation="vertical" className="h-[20px]" />
                      <Button
                        variant="secondary"
                        onClick={handleCopyClip}
                        className="px-3 shadow-none hover:bg-gray-300/50 hover:text-gray-600 h-8"
                      >
                        <CopyIcon className="h-3 w-3" />
                      </Button>
                      <Separator orientation="vertical" className="h-[20px]" />
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="secondary"
                            className="px-3 shadow-none hover:bg-gray-300/50 hover:text-gray-600 h-8"
                          >
                            <MoreHorizontal className="h-3 w-3" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-48 p-2">
                          <div className="flex flex-col gap-1">
                            <Button
                              variant="ghost"
                              onClick={() => setOpenEditClip(true)}
                              className="w-full justify-start gap-2 px-2 h-8"
                            >
                              <PencilIcon className="h-3 w-3" />
                              Edit
                            </Button>
                            <Button
                              variant="ghost"
                              onClick={handleDownloadClip}
                              className="w-full justify-start gap-2 px-2 h-8"
                            >
                              <DownloadIcon className="h-3 w-3" />
                              Download
                            </Button>
                            <SummaryButton
                              clipId={data.data.Id}
                              onSummarize={() => mutate(inputUrl)}
                            />
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>
              )}
              <Separator className="mb-4 mt-3" />
              <Markdown>{`# ${data.data.Title}\n\n${data.data.Content}`}</Markdown>
            </div>
          </div>
          {data.data && (
            <DialogEditClip
              open={openEditClip}
              onClose={() => {
                setOpenEditClip(false);
                mutate(inputUrl);
              }}
              title={data.data.Title}
              content={data.data.Content}
              clipId={data.data.Id}
            />
          )}
        </>
      )}
    </div>
  );
}
