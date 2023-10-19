import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCallback, useEffect, useState } from "react";
import { Markdown } from "@/components/markdown";
import {
  Circle,
  CopyIcon,
  DownloadIcon,
  ExternalLink,
  RefreshCw,
  Send,
  TagIcon,
  TrashIcon,
} from "lucide-react";
import { fetchMarkdown, fetchDeleteClip } from "@/lib/api/api";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { downloadText } from "@/lib/utils";
import { readingTime } from "reading-time-estimator";
import { useMutation } from "react-query";
import { toast } from "sonner";
import { DialogTag } from "@/components/dialog-tag";
import { useAuth } from "@/hooks/useAuth";

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
  const { navigate } = useAuth();
  const params = new URLSearchParams(window.location.search);
  const urlParam = params.get("url");
  const [inputUrl, setInputUrl] = useState(urlParam ?? "");
  const [openAddTag, setOpenAddTag] = useState(false);

  const { data, mutate, isLoading, error } = useMutation({
    mutationFn: fetchMarkdown,
    mutationKey: "fetchMarkdown",
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
      if (inputUrl !== "") {
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
    if (data?.data.Id) {
      deleteMutation.mutate(data.data.Id);
    }
  }, [data?.data.Id, deleteMutation]);

  const handleAddTag = useCallback(() => setOpenAddTag(true), []);

  useEffect(() => {
    if (urlParam !== null && !isLoading && !data && !deleteMutation.isLoading) {
      mutate(urlParam);
    }
  }, [urlParam, isLoading, error, data, mutate, deleteMutation.isLoading]);

  return (
    <div className="px-4 gap-4 min-h-[80vh]">
      <div className="py-4 w-full bg-gray-50 dark:bg-gray-900/90 dark:backdrop-blur">
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
                className="bg-white h-12 dark:bg-secondary"
              />
            </div>
            <div className="py-2">
              <Button className="h-12 dark:bg-secondary text-white">
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>

      {!isLoading && error !== null && inputUrl !== "" && (
        <div className="py-4 flex justify-center">
          <div className="bg-white dark:bg-secondary py-4 rounded-md w-full max-w-3xl px-4 border space-y-4">
            <p className="text-center text-rose-500 dark:text-rose-500/75">
              Failed to fetch article. Please check your url.
            </p>
          </div>
        </div>
      )}

      {isLoading && inputUrl !== "" && <LoadingSkeleton />}

      {data?.data && (
        <>
          <DialogTag
            clip={data.data}
            open={openAddTag}
            onOpenChange={setOpenAddTag}
          />
          <div className="pb-4">
            <div className="bg-white dark:bg-gray-800 py-4 rounded-md w-full min-w-xs max-w-md sm:max-w-3xl border block mx-auto">
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
                        <TrashIcon className="h-3 w-3" />
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
                      <Button
                        variant="secondary"
                        onClick={handleDownloadClip}
                        className="px-3 shadow-none hover:bg-gray-300/50 hover:text-gray-600 h-8"
                      >
                        <DownloadIcon className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              <Separator className="mb-4 mt-3" />
              <Markdown>{`# ${data.data.Title}\n\n${data.data.Content}`}</Markdown>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
