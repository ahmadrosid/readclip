import { Separator } from "@/components/ui/separator";
import { tools } from ".";
import { Title } from "@/components/ui/title";
import { useMutation } from "react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CopyIcon, DownloadIcon, ExternalLink, Loader2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { downloadText } from "@/lib/utils";
import { Markdown } from "@/components/markdown";
import { fetchRedditPost } from "@/lib/api/reddit";
import { UnauthorizedDialog } from "@/components/unauthorized-dialog";
import { useAuth } from "@/hooks/useAuth";

export default function RedditReader() {
  useAuth(false);
  const tool = tools.find((item) => item.slug === "reddit-reader");
  const [inputUrl, setInputUrl] = useState("");
  const [openDialogAuth, setOpenDialogAuth] = useState(false);

  const transcribeMutation = useMutation({
    mutationFn: fetchRedditPost,
    mutationKey: "reddit-reader",
    onError: (err: Error) => {
      if (err.message === "Unauthorized request, please login and try again!") {
        window.localStorage.setItem("redirect-auth", window.location.href);
        window.localStorage.setItem("cache-input-url", inputUrl);
        setOpenDialogAuth(true);
        return;
      }
      toast.error(err.message);
    },
  });

  const handleCopy = useCallback(() => {
    if (!transcribeMutation.data) return;
    navigator.clipboard
      .writeText(
        `# ${transcribeMutation.data.Title}\n\n${transcribeMutation.data.Content}`
      )
      .then(() => {
        toast.success("Copied to clipboard!");
      });
  }, [transcribeMutation.data]);

  const handleDownload = useCallback(() => {
    if (!transcribeMutation.data) return;
    const title = `${transcribeMutation.data.Title}.md`;
    downloadText(
      title,
      `# ${transcribeMutation.data.Title}\n\n${transcribeMutation.data.Content}`
    );
    toast.success(`Downloaded "${title}"!`);
  }, [transcribeMutation.data]);

  useEffect(() => {
    const url = window.localStorage.getItem("cache-input-url");
    if (url) {
      setInputUrl(url);
      window.localStorage.removeItem("cache-input-url");
    }
  }, []);

  return (
    <>
      <div className="container max-w-6xl mx-auto min-h-[80vh] px-2 sm:px-8">
        <div className="pt-6">
          <Title className="pb-2">{tool?.title}</Title>
          <p className="text-lg text-gray-600">{tool?.description}</p>
          <Separator className="mt-4" />
        </div>
        <div className="grid py-6 gap-6">
          <div className="flex gap-4 items-start">
            <div className="flex-1 grid gap-3">
              <form
                className="flex gap-2"
                onClick={(e) => {
                  e.preventDefault();
                  if (inputUrl === "") return;
                  transcribeMutation.mutate(inputUrl);
                }}
              >
                <Input
                  type="text"
                  name="reddit_url"
                  placeholder="Paste reddit video link here..."
                  className="bg-white dark:bg-gray-800 h-10"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.currentTarget.value)}
                />
                <Button
                  className="h-10 dark:text-white"
                  disabled={transcribeMutation.isLoading}
                >
                  {transcribeMutation.isLoading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    ""
                  )}
                  Submit
                </Button>
              </form>
              <Card className="min-h-[70vh]">
                <CardHeader>
                  {transcribeMutation.data && (
                    <div>
                      <CardTitle className="text-2xl flex justify-between items-center">
                        <div>
                          {transcribeMutation.data
                            ? transcribeMutation.data.Title
                            : ""}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="secondary"
                            onClick={handleCopy}
                            className="px-3 shadow-none hover:bg-gray-300/50 hover:text-gray-600 h-8"
                          >
                            <CopyIcon className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="secondary"
                            onClick={handleDownload}
                            className="px-3 shadow-none hover:bg-gray-300/50 hover:text-gray-600 h-8"
                          >
                            <DownloadIcon className="h-3 w-3" />
                          </Button>
                          <a href={inputUrl} target="_blank">
                            <Button
                              variant="secondary"
                              className="px-3 shadow-none hover:bg-gray-300/50 hover:text-gray-600 h-8"
                            >
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                          </a>
                        </div>
                      </CardTitle>
                      <Separator className="mt-4" />
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  {transcribeMutation.data ? (
                    <Markdown className="p-0 max-w-5xl">
                      {transcribeMutation.data.Content}
                    </Markdown>
                  ) : (
                    ""
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <UnauthorizedDialog
        open={openDialogAuth}
        onOpenChange={setOpenDialogAuth}
      />
    </>
  );
}
